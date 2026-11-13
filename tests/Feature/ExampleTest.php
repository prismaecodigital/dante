<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_the_root_redirects_to_the_login_page()
    {
        $response = $this->get('/');

        $response->assertRedirect('/login');
    }

    /**
     * The login page is rendered by the blade layout.
     *
     * @return void
     */
    public function test_the_login_page_renders()
    {
        $response = $this->get('/login');

        $response->assertOk();
    }
}
