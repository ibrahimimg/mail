# Mail
Design a front-end for an email client that makes API calls to send and receive emails.

## Solution
### Demo
click this image to watch it on youtube
[![demo](https://i.ytimg.com/vi/-KS4-q8toHQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=-KS4-q8toHQ)

### Setup
Make sure you have [Python3](https://https://www.python.org/) and [Django](https://www.djangoproject.com) framework Installed on your system.

### Running
     python manage.py makemigrations
     python manage.py migrate --run-syncdb
     python manage.py runserver

___

## cs50web Project3 Specification

Using JavaScript, HTML, and CSS, complete the implementation of your single-page-app email client. You must fulfill the following requirements:

1. Send Mail: When a user submits the email composition form, add JavaScript code to actually send the email.
2. Mailbox: When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.
3. View Email: When a user clicks on an email, the user should be taken to a view where they see the content of that email.
4. Archive and Unarchive: Allow users to archive and unarchive emails that they have received.
5. Reply: Allow users to reply to an email.

Read More about this project at [cs50 page](https://cs50.harvard.edu/web/2020/projects/3/mail/)
