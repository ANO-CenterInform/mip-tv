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

        self::register_post_types();
        self::register_taxonomies();
        self::add_acf_field();

        add_action( 'updated_post_meta', array( 'MipTv', 'update_video' ), 10, 3 );
        add_action( 'wp_after_insert_post', array( 'MipTv', 'video_save' ), 10, 3 );
        add_action( 'wp_enqueue_scripts', array('MipTv', 'enqueue_scripts'), 1, 3 );
        add_filter( 'rest_video_query', array('MipTv', 'video_meta_request_params'), 99, 2 );

        flush_rewrite_rules(false);
        Timber::$locations = __DIR__.'/views';

    }

    /**
     * Register Video post type if not exist
     *
     * @return void
     */
    public static function register_post_types():void
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
                'query_var'           => true,
            ] );
        }
    }

    /**
     * Register Video Category Taxonomy
     *
     * @return void
     */
    public static function register_taxonomies()
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
            "rewrite" => [ 'slug' => 'video_categories', 'with_front' => true, ],
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

    public static function add_acf_field():void
    {
        if( function_exists('acf_add_local_field_group') )
        {
            acf_add_local_field_group([

                'key' => 'group_video',
                'title' => 'Поля',
                'fields' => [
                    [
                        'key' => 'field_video_url',
                        'label' => 'Адрес видео',
                        'name' => 'video_url',
                        'type' => 'text',
                        'required' => 1,
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
                        'key' => 'field_video_type',
                        'label' => 'Video Type',
                        'name' => 'video_type',
                        'type' => 'text',
                        'readonly' => 1,
                        'disabled' => 1,
                    ],
                    [
                        'key' => 'field_video_id',
                        'label' => 'Video ID',
                        'name' => 'video_id',
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
        }
    }

    public static function update_video( $meta_id, $post_id, $meta_key='', $meta_value='' )
    {
        // Stop if not the correct meta key
        if ( $meta_key != 'video_url') {
            return false;
        }
        $video_url = get_post_meta($post_id, 'video_url', 1);
        update_post_meta( $post_id, 'video_type', self::determineVideoUrlType($video_url)['video_type']);
        update_post_meta( $post_id, 'video_id', self::determineVideoUrlType($video_url)['video_id']);
    }

    /**
     * When save new Video
     * @param $url
     * @return array
     */

    public static function video_save($post_id, $post, $post_before)
    {
        if( 'video' !== $post->post_type) {
            return;
        }

        if ($post->post_status !== 'publish') {
            return;
        }

        $video_url = get_post_meta($post_id, 'video_url', 1);
        update_post_meta( $post_id, 'video_type', self::determineVideoUrlType($video_url)['video_type']);
        update_post_meta( $post_id, 'video_id', self::determineVideoUrlType($video_url)['video_id']);
    }

    public static function determineVideoUrlType($url)
    {

        $yt_rx = '/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/';
        $has_match_youtube = preg_match($yt_rx, $url, $yt_matches);

        $vm_rx = '/(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/';
        $has_match_vimeo = preg_match($vm_rx, $url, $vm_matches);

        $rutube_rx = '/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:rutube\.ru))(\/video\/)([\w\-]+)?\/$/';
        $has_match_rutube = preg_match($rutube_rx, $url, $rutube_matches);

        if($has_match_youtube) {
            $video_id = $yt_matches[5];
            $type = 'youtube';
        }
        elseif($has_match_vimeo) {
            $video_id = $vm_matches[5];
            $type = 'vimeo';
        }
        elseif($has_match_rutube) {
            $video_id = $rutube_matches[5];
            $type = 'rutube';
        }
        else {
            $video_id = 0;
            $type = 'none';
        }

        $data['video_id'] = $video_id;
        $data['video_type'] = $type;

        return $data;

    }

    public static function enqueue_scripts()
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

    public static function video_meta_request_params( $args, $request )
    {
        $args += array(
            'meta_key' => $request['meta_key'],
            'meta_value' => $request['meta_value'],
            );
        return $args;
    }

}
