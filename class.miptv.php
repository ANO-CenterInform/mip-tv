<?php

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

        flush_rewrite_rules(false);

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
                'supports'            => [ 'title','thumbnail', 'revisions', 'custom-fields' ],
                'taxonomies'          => ['video_categories'],
                'has_archive'         => false,
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
            'show_in_rest'        => false,
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
                    ]
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

            ]);
        }

    }

}
