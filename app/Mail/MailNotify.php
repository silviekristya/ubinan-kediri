<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MailNotify extends Mailable implements ShouldQueue
{
  use Queueable, SerializesModels;

  /**
   * Create a new message instance.
   *
   * @return void
   */
  public $title;
  public $body;

  public function __construct($title, $body)
  {
    $this->title = $title;
    $this->body = $body;
  }

  /**
   * Build the message.
   *
   * @return $this
   */
  public function build()
  {
    return $this->view('mail.notify')
      ->subject('[LAXO] ' . $this->title)
      ->with([
        'body' => $this->body,
        'logo' => public_path('/assets/logo.png'),
      ]);
  }
}
