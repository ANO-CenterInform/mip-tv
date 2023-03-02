<?php
/**
 * Plugin Name: Mip TV
 * Description: Video Section for WP sites.
 * Version: 1.0.0
 * Author: ANO CenterInform
 * Author URI: https://c-inf.ru/
 **/

// Make sure we don't expose any info if called directly
if ( !function_exists( 'add_action' ) ) {
    echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
    exit;
}

define( 'MIPTV_VERSION', '1.0.0' );
define( 'MIPTV__MINIMUM_WP_VERSION', '5.0' );
define( 'MIPTV__PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

require_once( MIPTV__PLUGIN_DIR . 'class.miptv.php' );

add_action( 'init', array( 'MipTv', 'init' ) );
