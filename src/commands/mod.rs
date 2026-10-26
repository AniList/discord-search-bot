use std::{collections::HashMap, sync::LazyLock, time::Duration};

use graphql_client::{GraphQLQuery, Response};
use html2md::{TagHandler, TagHandlerFactory};
use poise::{
	serenity_prelude::{self as serenity, futures::StreamExt},
	CreateReply,
};

pub(crate) mod character;
pub(crate) mod media;
pub(crate) mod staff;
pub(crate) mod studio;
pub(crate) mod user;

pub(crate) async fn anilist_query<Q: GraphQLQuery>(
	variables: Q::Variables,
) -> Result<Option<Q::ResponseData>, crate::Error> {
	static CLIENT: LazyLock<reqwest::Client> = LazyLock::new(reqwest::Client::new);

	let response: Response<Q::ResponseData> = CLIENT
		.post("https://graphql.anilist.co")
		.json(&Q::build_query(variables))
		.send()
		.await?
		.json()
		.await?;

	Ok(response.data)
}

pub(crate) fn anilist_url(kind: &str, id: i64) -> String {
	format!("https://anilist.co/{}/{}", kind, id)
}

pub(crate) fn clean_html(text: &str) -> String {
	let text = text.replace("\n\n", "<br>");

	let mut tag_factory: HashMap<String, Box<dyn TagHandlerFactory>> = HashMap::new();
	tag_factory.insert(String::from("span"), Box::new(SpoilerStripperFactory {}));
	let text = html2md::parse_html_custom(&text, &tag_factory);

	let text = text.replace("---", "");
	let text = text.replace("#", "");

	text
}

pub(crate) fn truncate_bio(bio: String) -> String {
	// Keep bios short, but if it has <100 characters left, just let it finish
	if bio.chars().count() < 500 {
		return bio;
	}

	let truncated: String = bio.chars().take(400).collect();
	format!("{truncated}...")
}

pub(crate) async fn send_deletable<'a>(
	context: crate::Context<'a>,
	msg: CreateReply,
) -> Result<(), serenity::Error> {
	let msg_handle = context.send(msg).await?;
	let msg = msg_handle.message().await?;

	let bot_reaction = &msg.react(
			&context,
			serenity::ReactionType::Unicode(String::from("❌")),
		)
		.await?;

	let mut collector = serenity::ReactionCollector::new(context)
		.timeout(Duration::from_secs(20))
		.message_id(msg.id)
		.author_id(context.author().id)
		.filter(move |reaction| reaction.emoji.unicode_eq("❌"))
		.stream();

	match collector.next().await {
		Some(_) => msg_handle.delete(context).await?,
		None => bot_reaction.delete(context).await?,
	}

	Ok(())
}

struct SpoilerStripperFactory;

impl TagHandlerFactory for SpoilerStripperFactory {
	fn instantiate(&self) -> Box<dyn TagHandler> {
		return Box::new(SpoilerStripper::default());
	}
}

#[derive(Default)]
pub(crate) struct SpoilerStripper;

impl TagHandler for SpoilerStripper {
	fn handle(&mut self, _tag: &html2md::Handle, _printer: &mut html2md::StructuredPrinter) {}

	fn skip_descendants(&self) -> bool {
		true
	}

	fn after_handle(&mut self, _printer: &mut html2md::StructuredPrinter) {}
}
