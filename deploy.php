<?php
namespace Deployer;

require 'recipe/wordpress.php';

// Config

set('repository', 'git@github.com:ANO-CenterInform/mip-tv.git');
set( 'application', 'mip-tv' );
set( 'plugin_dir', '/home/shamagir/sites/mosinzh.shamagir.ru/wp-content/plugins' );

add('shared_files', []);
add('shared_dirs', []);
add('writable_dirs', []);

// Hosts

host('188.68.217.156')
    ->set( 'branch', 'staging' )
    ->set('remote_user', 'shamagir')
    ->set('deploy_path', '~/{{application}}');

task( 'deploy:plugin', function () {
    run( 'ln -sfn {{deploy_path}}/current {{plugin_dir}}/{{application}}' );
} );


/**
 * Main task
 */
task( 'deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:writable',
    'deploy:vendors',
    'deploy:clear_paths',
    'deploy:symlink',
    'deploy:plugin',
    'deploy:unlock',
    'cleanup',
    'success'
] )->desc( 'Deploy your plugin' );

// Hooks

after('deploy:failed', 'deploy:unlock');
