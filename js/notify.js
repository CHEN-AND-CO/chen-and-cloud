class NotifyNotification
{
    constructor( title, content, type='info', showtime=10000, onShow = () => {}, onHide = () => {} )
    {
        this.title = title;
        this.content = content;

        this.type = type;
        this.showtime = showtime;

        this.onshow = onShow;
        this.onhide = onHide;

        this.DOMElement = document.createElement('div');
        console.log(this.DOMElement);
        
        this.DOMElement.classList.add('notification');
        this.DOMElement.classList.add('notif-hidden');
        this.DOMElement.classList.add(this.type);
                                 /*.add('notif-hidden')
                                 .add(this.type);*/

        this.DOMElement.innerHTML = '<h3>'+this.title+'</h3>';
        this.DOMElement.innerHTML += '<p>'+this.content+'</p>';
        this.DOMElement.innerHTML += '<button>×</button>';

        var parent = document.getElementById('notify-container');
        if ( parent )
        {
            parent.appendChild(this.DOMElement);
        }
        
        setTimeout( () => {
            this.display();
        }, 50);

        if ( this.showtime != -1 ) setTimeout( () => {
            this.hide();
        }, this.showtime);        
    }

    display()
    {
        console.log("show");
        this.DOMElement.classList.remove('notif-hidden');
        this.onshow();
    }

    hide()
    {
        this.DOMElement.classList.add('notif-hidden');
        this.onhide();

        this.DOMElement.ontransitionend = () => {
            this.DOMElement.remove();
        }
    }
}