document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#container').style.display = 'none'

  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').onsubmit = function(){
    let recipients = document.querySelector('#compose-recipients').value
    let subject = document.querySelector('#compose-subject').value
    let body = document.querySelector('#compose-body').value
    
    fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        if (result["error"] === undefined){
          load_mailbox('sent')
        }
        else{
          alert(result["error"])
        }
    });
    return false
  }


}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#container').style.display = 'block'

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  document.querySelector('#container').innerHTML = ''
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(e =>{
      let dis = (mailbox=="inbox" | mailbox=="archive") ? "from" : "to"
      let bgcolor = (e.read==true) ? "rgb(255,255,255)" : "rgb(229,229,229)"
      const element = document.createElement('a')
      element.className="list-group-item list-group-item-action"
      element.setAttribute('href', '#');
      element.setAttribute('style', `background-color:${bgcolor};`)
      element.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${e.subject.slice(0, 50)}</h5>
          <small>${e.timestamp}</small>
        </div>
        <p class="mb-1">${e.body.slice(0, 100)}</p>
        <small>${dis} ${e.sender}</small>
        `
      element.addEventListener('click', function() {
        fetch(`/emails/${e.id}`,{
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
        })
        fetch(`/emails/${e.id}`)
        .then(response => response.json())
        .then(email => {
            //console.log(email);
            let btn = ""
            let to_archive = (e.archived==false) ? true: false
            let indicator = "light"
            let display_a = "archive"
            if (e.archived == true){
              display_a = "unarchive"
            }
            if (mailbox!=="sent"){
              btn = `<button id="rbt" class="btn btn-primary">replay</button>
                <button id="abt" class="btn btn-dark">${display_a}</button>`
            }
            document.querySelector('#container').innerHTML = `
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">${e.subject}</h2>
                <h6>from: ${e.sender}</h6>
                <h6>to: ${e.recipients}</h6>
                <h6>timestamp: ${e.timestamp}<h6>
                ${btn}
              </div>
              <div class="card-body">
                <p class="card-text">${e.body.replace("\n","<p>")}</p>
              </div>
            </div>
            `
            console.log(e.body)
            if (mailbox!=="sent"){
              document.querySelector('#rbt').onclick = function(){
                compose_email();
                document.querySelector('#compose-recipients').value = e.sender;
                let subject = document.querySelector('#compose-subject').value;
                if (e.subject.includes("Re")){
                  document.querySelector('#compose-subject').value = e.subject;
                }
                else{document.querySelector('#compose-subject').value=`Re: ${e.subject}`}
                document.querySelector('#compose-body').value = `On ${e.timestamp} ${e.sender} wrote: ${e.body}`
              }
              document.querySelector('#abt').onclick = function(){
                fetch(`/emails/${e.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                      archived: to_archive
                  })
                })
                window.location.replace("/")
              }
            }
        });
      });
      document.querySelector('#container').append(element);

    })
  });

}


function handleClick(id){
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      console.log(email);
  });
}