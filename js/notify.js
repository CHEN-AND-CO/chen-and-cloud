class Notification
{
    constructor( title, content, options = { type:'info', showtime:2000, onShow:() => {}, onHide:() => {} } )
    {
        this.title = title;
        this.content = content;

        this.type = options.type;
        this.showtime = options.showtime;

        this.onshow = options.onShow;
        this.onhide = options.onHide;

        this.DOMElement = document.createElement('div');

        this.DOMElement.classList.add('notification')
                                 .add('notif-hidden')
                                 .add(this.type);

        this.DOMElement.innerHTML = '<h3>'+this.title+'</h3>';
        this.DOMElement.innerHTML += '<p>'+this.content+'</p>';
        this.DOMElement.innerHTML += '<button>×</button>';

        var parent = document.getElementById('notify-container');
        if ( parent )
        {
            parent.appendChild(this.DOMElement);
        }
        
        this.display();
    }

    display()
    {
        this.DOMElement.classList.remove('notif-hidden');
        this.onshow();
    }

    hide()
    {
        this.DOMElement.classList.add('notif-hidden');
        this.onhide();
    }
}