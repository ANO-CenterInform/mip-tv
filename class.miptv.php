<?php
declare( strict_types = 1 );

use Timber\Timber;

class MipTv{

    private static $initiated = false;

    public static function init()
    {
        if ( ! self::$initiated ) {
            self::init_hooks();
        }
    }

    /**
     * Initializes WordPress hooks
     */
    private static function init_hooks()
    {
        self::$initiated = true;

        self::registerPostTypes();
        self::registerTaxonomies();
        self::addAcfField();
        self::addOptionsPage();

        add_action( 'updated_post_meta', array( 'MipTv', 'updateVideo'), 10, 3 );
        add_action( 'save_post', array( 'MipTv', 'setHash'), 10, 3 );
        add_action( 'wp_after_insert_post', array( 'MipTv', 'videoSave'), 10, 3 );
        add_action( 'wp_enqueue_scripts', array('MipTv', 'enqueueScripts'), 1, 3 );
        add_filter( 'rest_video_query', array('MipTv', 'video_meta_request_params'), 10, 2 );
        add_filter( 'body_class', array('MipTv', 'setBlockedClass'), 10, 2 );

        flush_rewrite_rules(false);
        Timber::$locations = __DIR__.'/views';

    }

    /**
     * Register Video post type if not exist
     *
     * @return void
     */
    public static function registerPostTypes():void
    {
        if(!post_type_exists('video')) {
            register_post_type( 'video', [
                'label'  => null,
                'labels' => [
                    'name'               => __('Видео', 'miptv'),
                    'singular_name'      => __('Видео', 'miptv'),
                    'add_new'            => __('Создать видео', 'miptv'),
                    'add_new_item'       => __('Создание видео', 'miptv'),
                    'edit_item'          => __('Редактировать', 'miptv'),
                    'new_item'           => __('Новая', 'miptv'),
                    'view_item'          => __('Смотреть', 'miptv'),
                    'search_items'       => __('Искать', 'miptv'),
                    'not_found'          => __('Не найдено', 'miptv'),
                    'not_found_in_trash' => __('Не найдено в корзине', 'miptv'),
                    'parent_item_colon'  => '',
                    'menu_name'          => __('Видео', 'miptv'),
                ],
                'description'         => '',
                'public'              => true,
                'show_ui'             => true,
                'show_in_nav_menus'   => true,
                'show_in_menu'        => true,
                'show_in_admin_bar'   => true,
                'show_in_rest'        => true,
                'menu_icon'           => 'dashicons-format-video',
                'capability_type'   => 'post',
                'hierarchical'        => false,
                'supports'            => [ 'title', 'revisions', 'custom-fields' ],
                'taxonomies'          => ['video_categories'],
                'has_archive'         => true,
                "rewrite" => [ 'slug' => 'tv', 'with_front' => true, ],
                'query_var'           => true,
            ] );
        }
    }

    /**
     * Register Video Category Taxonomy
     *
     * @return void
     */
    public static function registerTaxonomies()
    {

        $labels = [
            "name" => __( "Категории", 'miptv' ),
            "singular_name" => __( "Категория", 'miptv' ),
        ];

        $args = [
            "label" => __( "Категории", 'miptv' ),
            "labels" => $labels,
            "public" => true,
            "publicly_queryable" => true,
            "hierarchical" => false,
            "show_ui" => true,
            "show_in_menu" => true,
            "show_in_nav_menus" => true,
            "query_var" => true,
            "rewrite" => [ 'slug' => 'videos', 'with_front' => true, ],
            "show_admin_column" => false,
            "show_tagcloud" => false,
            "show_in_quick_edit" => true,
            'show_in_rest'        => true,
            "sort" => false,
            "show_in_graphql" => false,
            'meta_box_cb' => false,
        ];
        register_taxonomy( "video_categories", [ "video" ], $args );
    }

    /**
     * Register ACF Fields
     *
     * @return void
     */
    public static function addAcfField():void
    {
        if( function_exists('acf_add_local_field_group') )
        {
            acf_add_local_field_group([

                'key' => 'group_video',
                'title' => 'Поля',
                'fields' => [
                    [
                        'key' => 'field_youtube_url',
                        'label' => 'Адрес видео на Youtube',
                        'name' => 'video_youtube_url',
                        'type' => 'text',
                        'required' => 1,
                    ],
                    [
                        'key' => 'field_rutube_url',
                        'label' => 'Адрес видео на Rutube',
                        'name' => 'video_rutube_url',
                        'type' => 'text',
                        'required' => 0,
                    ],
                    [
                        'key' => 'field_video_thumbnail',
                        'label' => 'Изображение',
                        'name' => 'video_thumbnail',
                        'type' => 'image',
                        'required' => 1,

                    ],
                    [
                        'key' => 'field_video_categories',
                        'label' => 'Категория',
                        'name' => 'video_categories',
                        'type' => 'taxonomy',
                        'taxonomy' => 'video_categories',
                        'field_type' => 'select',
                        'load_save_terms' 	=> 1,
                        'required' => 1,
                        'add_term' => 1,
                        'ui' => 1
                    ],
                    [
                        'key' => 'field_video_description',
                        'label' => 'Описание',
                        'name' => 'video_description',
                        'type' => 'wysiwyg',
                        'toolbar' => 'basic',
                        'media_upload' => 0,
                        'required' => 1,

                    ],
                    [
                        'key' => 'field_video_id',
                        'label' => 'Video ID',
                        'name' => 'video_id',
                        'type' => 'text',
                        'readonly' => 1,
                        'disabled' => 1,
                    ],
                    [
                        'key' => 'field_video_hash',
                        'label' => 'Video Hash',
                        'name' => 'video_hash',
                        'type' => 'text',
                        'readonly' => 1,
                        'disabled' => 1,
                    ],
                ],
                'location' => [
                    [
                        [
                            'param' => 'post_type',
                            'operator' => '==',
                            'value' => 'video',
                        ],
                    ],
                ],
                'show_in_rest' => true
            ]);
            acf_add_local_field_group([

                'key' => 'group_video_settings',
                'title' => 'Настройки Видеораздела',
                'fields' => [
                    [
                        'key' => 'field_block_youtube',
                        'label' => 'Заблокировать YouTube',
                        'name' => 'block_youtube',
                        'type' => 'true_false',
                        'default' => false,
                        'ui' => 1
                    ],
                ],
                'location' => [
                    [
                        [
                            'param' => 'options_page',
                            'operator' => '==',
                            'value' => 'video-settings',
                        ],
                    ],
                ],
                'show_in_rest' => true
            ]);
        }
    }

    /**
     * Update Metafield when new Video updated
     * @param $meta_id
     * @param $post_id
     * @param string $meta_key
     * @param string $meta_value
     * @return false
     */
    public static function updateVideo($meta_id, $post_id, $meta_key='', $meta_value='' )
    {
        // Stop if not the correct meta key
        if ( $meta_key != 'video_url') {
            return false;
        }

        self::updateMetaFields($post_id);
    }

    /**
     * When save new Video
     * @param $post_id
     * @param $post
     * @param $post_before
     * @return void
     */
    public static function videoSave($post_id, $post, $post_before): void
    {
        if( 'video' !== $post->post_type) {
            return;
        }

        if ($post->post_status !== 'publish') {
            return;
        }

        self::updateMetaFields($post_id);

    }

    /**
     * Helper to update metafields
     * @param $post_id
     * @return void
     */
    private static function updateMetaFields($post_id): void
    {
        $video_youtube_url = get_post_meta($post_id, 'video_youtube_url', 1);
        $video_rutube_url = get_post_meta($post_id, 'video_rutube_url', 1);

        update_post_meta( $post_id, 'video_id', [
            'youtube' => self::determineVideoUrlType($video_youtube_url)['video_id'],
            'rutube' => self::determineVideoUrlType($video_rutube_url)['video_id']
        ]);
    }

    /**
     * Transform video url to Id
     * @param $url
     * @return array
     */
    public static function determineVideoUrlType($url): array
    {

        $yt_rx = '/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/';
        $has_match_youtube = preg_match($yt_rx, $url, $yt_matches);

        $rutube_rx = '/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:rutube\.ru))(\/video\/)([\w\-]+)\/?$/';
        $has_match_rutube = preg_match($rutube_rx, $url, $rutube_matches);

        if($has_match_youtube) {
            $video_id = $yt_matches[5];
        }
        elseif($has_match_rutube) {
            $video_id = $rutube_matches[5];
        }
        else {
            $video_id = null;
        }

        $data['video_id'] = $video_id;

        return $data;

    }

    /**
     * Append style and js
     */
    public static function enqueueScripts()
    {
        wp_enqueue_script(
            'mip-tv-script',
            plugin_dir_url(__FILE__) . 'dist/assets/main.js',
            false,
            false,
            true,
        );

        wp_enqueue_style('mip-tv-style', plugin_dir_url(__FILE__) . 'dist/assets/style.css', array(), false, 'all');
    }

    /**
     * Add extra request query for REST
     * @param $args
     * @param $request
     * @return array
     */
    public static function video_meta_request_params( $args, $request )
    {
        $args += array(
            'meta_key' => $request['meta_key'],
            'meta_value' => $request['meta_value'],
            );
        return $args;
    }

    /**
     * Add options page for Video section
     *
     * @return void
     */

    private static function addOptionsPage(): void
    {
        if( function_exists('acf_add_options_page') ) {

            acf_add_options_page(array(
                'page_title'    => 'Настройки Видеораздела',
                'menu_title'    => 'Видеораздел',
                'menu_slug'     => 'video-settings',
                'capability'    => 'edit_posts',
                'redirect'      => false
            ));
        }
    }

    /**
     * Check if Youtube is blocked in settings and add class to Body
     */

    public static function checkIfYTBlocked(): bool
    {
        return get_field('field_block_youtube', 'options');
}

    /**
     * Check if Youtube is blocked in settings and add class to Body
     */

    public static function setBlockedClass($classes): array
    {
        $blocked = self::checkIfYTBlocked();

        if($blocked) {
            $classes[] = 'yt-blocked';
        }

        return $classes;
    }

    /**
     * Set hash for new video posts
     * @param $post_id
     * @param $post
     * @param $update
     * @throws Exception
     */
    public static function setHash( $post_id, $post, $update ): void
    {
        // Only want to set if this is a new post!
        if ($update) {
            return;
        }

        // Only set for post_type = post!
        if ('video' !== $post->post_type) {
            return;
        }

        update_post_meta($post_id, 'video_hash', bin2hex(random_bytes(5)));
    }


}
