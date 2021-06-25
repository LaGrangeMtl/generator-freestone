<?php include "header.php"; ?>
<div data-scrollbar data-main>
	<main class="main-content">
		<? if ( have_posts() ) {
			while ( have_posts() ) {
				the_post();
				the_content();
			}
		} ?>
	</main>
	<?php include "footer.php"; ?>
</div>