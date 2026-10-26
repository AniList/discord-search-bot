use graphql_client::GraphQLQuery;
use poise::serenity_prelude as serenity;

use super::{anilist_query, anilist_url, clean_html, send_deletable, truncate_bio};

#[derive(GraphQLQuery)]
#[graphql(
	schema_path = "schema.json",
	query_path = "queries/SearchMedia.graphql"
)]
struct SearchMedia;

/// Searches for an anime by name
#[poise::command(slash_command, rename = "anime")]
pub(crate) async fn find_anime(
	ctx: crate::Context<'_>,
	#[description = "Title to search"] name: String,
) -> Result<(), crate::Error> {
	find_media(ctx, name, search_media::MediaType::ANIME).await
}

/// Searches for a manga by name
#[poise::command(slash_command, rename = "manga")]
pub(crate) async fn find_manga(
	ctx: crate::Context<'_>,
	#[description = "Title to search"] name: String,
) -> Result<(), crate::Error> {
	find_media(ctx, name, search_media::MediaType::MANGA).await
}

async fn find_media(
	ctx: crate::Context<'_>,
	name: String,
	media_type: search_media::MediaType,
) -> Result<(), crate::Error> {
	let kind = match &media_type {
		search_media::MediaType::MANGA => "manga",
		_ => "anime",
	};
	let Some(media) = anilist_query::<SearchMedia>(search_media::Variables {
		search: name,
		type_: media_type,
	})
	.await?
	.and_then(|data| data.media) else {
		ctx.say("Not found").await?;
		return Ok(());
	};

	let media_stats = if media.status.is_some() || media.mean_score.is_some() {
		let score = match &media.mean_score {
			// Use the en quad space after days watched to not get stripped by Discord
			Some(score) => format!("Score: {}%  ", score),
			None => "".to_string(),
		};

		let mut status = match media.status {
			Some(status) => match status {
				search_media::MediaStatus::RELEASING => "Releasing",
				search_media::MediaStatus::NOT_YET_RELEASED => "Not yet released",
				search_media::MediaStatus::FINISHED => "Finished",
				search_media::MediaStatus::CANCELLED => "Cancelled",
				search_media::MediaStatus::HIATUS => "Hiatus",
				search_media::MediaStatus::Other(_unknown_status) => "",
			},
			None => "",
		}
		.to_string();

		if status.len() > 0 {
			status = format!("Status: {}", status);
		}

		format!("{}{}", score, status)
	} else {
		"".to_string()
	};

	let description = match &media.description {
		Some(desc) => truncate_bio(clean_html(desc)),
		None => "".to_string(),
	};

	let title = media
		.title
		.and_then(|title| title.romaji)
		.unwrap_or_else(|| "Unknown title".to_string());
	let site_url = media
		.site_url
		.unwrap_or_else(|| anilist_url(kind, media.id));
	let author = serenity::CreateEmbedAuthor::new(title)
		.icon_url("https://anilist.co/img/icons/favicon-32x32.png")
		.url(&site_url);
	let mut embed = serenity::CreateEmbed::new()
		.author(author)
		.description(description)
		.color(3447003)
		.footer(serenity::CreateEmbedFooter::new(media_stats));
	if let Some(cover) = media.cover_image.and_then(|cover| cover.extra_large) {
		embed = embed.thumbnail(cover);
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
