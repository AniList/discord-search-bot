use graphql_client::GraphQLQuery;
use poise::serenity_prelude as serenity;

use super::{anilist_query, anilist_url, clean_html, send_deletable, truncate_bio};

#[derive(GraphQLQuery)]
#[graphql(
	schema_path = "schema.json",
	query_path = "queries/SearchCharacter.graphql"
)]
struct SearchCharacter;

/// Searches for a character by name
#[poise::command(slash_command, rename = "character")]
pub(crate) async fn find_character(
	ctx: crate::Context<'_>,
	#[description = "Name to search"] name: String,
) -> Result<(), crate::Error> {
	let Some(character) =
		anilist_query::<SearchCharacter>(search_character::Variables { search: name })
			.await?
			.and_then(|data| data.character)
	else {
		ctx.say("Not found").await?;
		return Ok(());
	};

	let bio = match &character.description {
		Some(bio) => truncate_bio(clean_html(bio)),
		None => "".to_string(),
	};

	let character_name = character
		.name
		.and_then(|name| name.full)
		.unwrap_or_else(|| "Unknown name".to_string());
	let site_url = character
		.site_url
		.unwrap_or_else(|| anilist_url("character", character.id));
	let author = serenity::CreateEmbedAuthor::new(character_name)
		.icon_url("https://anilist.co/img/icons/favicon-32x32.png")
		.url(&site_url);
	let mut embed = serenity::CreateEmbed::new()
		.author(author)
		.description(bio)
		.color(3447003);
	if let Some(image) = character.image.and_then(|image| image.large) {
		embed = embed.thumbnail(image);
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
