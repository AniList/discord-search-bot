use graphql_client::GraphQLQuery;
use poise::serenity_prelude as serenity;

use super::{anilist_query, anilist_url, clean_html, send_deletable, truncate_bio};

#[derive(GraphQLQuery)]
#[graphql(
	schema_path = "schema.json",
	query_path = "queries/SearchStaff.graphql"
)]
struct SearchStaff;

/// Searches for a staff member by name
#[poise::command(slash_command, rename = "staff")]
pub(crate) async fn find_staff(
	ctx: crate::Context<'_>,
	#[description = "Name to search"] name: String,
) -> Result<(), crate::Error> {
	let Some(staff) = anilist_query::<SearchStaff>(search_staff::Variables { search: name })
		.await?
		.and_then(|data| data.staff)
	else {
		ctx.say("Not found").await?;
		return Ok(());
	};

	let bio = match &staff.description {
		Some(bio) => truncate_bio(clean_html(bio)),
		None => "".to_string(),
	};

	let staff_name = staff
		.name
		.and_then(|name| name.full)
		.unwrap_or_else(|| "Unknown name".to_string());
	let site_url = staff
		.site_url
		.unwrap_or_else(|| anilist_url("staff", staff.id));
	let author = serenity::CreateEmbedAuthor::new(staff_name)
		.icon_url("https://anilist.co/img/icons/favicon-32x32.png")
		.url(&site_url);
	let mut embed = serenity::CreateEmbed::new()
		.author(author)
		.description(bio)
		.color(3447003);
	if let Some(image) = staff.image.and_then(|image| image.large) {
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
