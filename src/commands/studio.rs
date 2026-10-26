use graphql_client::GraphQLQuery;
use poise::serenity_prelude as serenity;

use super::{anilist_query, anilist_url, send_deletable};

#[derive(GraphQLQuery)]
#[graphql(
	schema_path = "schema.json",
	query_path = "queries/SearchStudio.graphql"
)]
struct SearchStudio;

/// Searches for a studio by name
#[poise::command(slash_command, rename = "studio")]
pub(crate) async fn find_studio(
	ctx: crate::Context<'_>,
	#[description = "Name to search"] name: String,
) -> Result<(), crate::Error> {
	let Some(studio) = anilist_query::<SearchStudio>(search_studio::Variables { search: name })
		.await?
		.and_then(|data| data.studio)
	else {
		ctx.say("Not found").await?;
		return Ok(());
	};

	let popular_titles = collect_titles(studio.popular.as_ref());
	let latest_titles = collect_titles(studio.latest.as_ref());

	let site_url = studio
		.site_url
		.unwrap_or_else(|| anilist_url("studio", studio.id));
	let author = serenity::CreateEmbedAuthor::new(&studio.name)
		.icon_url("https://anilist.co/img/icons/favicon-32x32.png")
		.url(&site_url);
	let mut embed = serenity::CreateEmbed::new().author(author).color(3447003);
	if let Some(titles) = popular_titles {
		embed = embed.field("Popular Titles", titles, true);
	}
	if let Some(titles) = latest_titles {
		embed = embed.field("Latest Titles", titles, true);
	}

	send_deletable(
		ctx,
		poise::CreateReply {
			content: Some(format!("<{}>", site_url)),
			embeds: vec![embed],
			reply: true,
			..Default::default()
		},
	)
	.await?;
	Ok(())
}

fn collect_titles(media: Option<&search_studio::studioMedia>) -> Option<String> {
	let titles: Vec<String> = media?
		.nodes
		.iter()
		.flatten()
		.flatten()
		.filter_map(|node| {
			let title = node.title.as_ref()?.romaji.as_ref()?;
			let url = node.site_url.as_ref()?;
			Some(format!("- [{}]({})", title, url))
		})
		.collect();

	(!titles.is_empty()).then(|| titles.join("\n"))
}
