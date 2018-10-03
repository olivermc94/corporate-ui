Polymer({
  is: name,
  properties: {
    variation: 0,
    fullbleed: {
      type: Boolean,
      value: true
    },
    text: {
      type: String,
      value: ''
    },
    location: {
      type: String,
      value: ''
    },
    caption: {
      type: String,
      value: ''
    },
    children: {
      type: Array,
      observer: 'toggleModeToggler'
    },
    haveChildren: {
      type: Boolean
    },
    icon: {
      type: String,
      observer: 'AddIcon'
    },
    active: {
      type: String,
      observer: 'setActive'
    },
    dropdown: {
      type: Boolean,
      value: false
    }
  },
  listeners: {
    'dom-change': 'render'
  },
  render: function() {
    var anchors = this.querySelectorAll('a[href=""]');

    for (var i = 0; i < anchors.length; i++) {
      var anchor = anchors[i];
      if (!anchor.attributes.href.value) {
        anchor.onclick = function(event) {
          event.preventDefault();
        }
      }
    }

    var a = this.querySelector('a');

    var attrs = [].slice.call(this.attributes).filter(function(item) {
      if (item.name.indexOf('attr-') == 0) {
        return true;
      }
    });

    if (a) {
      for(var i=0; i<attrs.length; i++) {
        var key = attrs[i].name,
            attr = key.replace('attr-', '');

        a.setAttribute(attr, this.attributes[key].value);
      }

      if(this.children && this.dropdown) {
        a.classList.add('dropdown-toggle');
        a.setAttribute('data-toggle', 'dropdown');
      }
    }
  },
  attached: function() {
    if( this.hasClass(this, 'active') ) {
      this.toggleExpand(this._getEvent());
    }

    if(this.querySelector('sub-navigation')) {
      this.haveChildren = true;
    }

    if (this.active && this.active.toString() == 'true') {
      this.setActive(true);
    }

    this.toggleClass('expanded', this.hasClass(this, 'active'));

    this.listen(this, 'tap', 'onTap');
  },
  onTap: function() {
    if (this.dropdown) {
      if (!this.classList.contains('more') && !this.active) {
        this.reSetActive();
      }
      return;
    }

    this.active = true;

    if(window.innerWidth < 991) {
      var event = document.createEvent('Event');
      event.initEvent('navigation-close', true, true);
      this.dispatchEvent(event);
    }
  },
  setActive: function(newState) {
    if (newState.toString() == 'true') {
      this.classList.add('active');

      this.async(function() {
        this.fire('navItem-active');
      });
    } else {
      this.classList.remove('active');
    }
  },
  reSetActive: function() {
    this.children.map(function(item, key) {
      if (item.active) {
        this.set('children.' + key + '.active', false);
      }
    }, this);
  },
  setDropdownItemActive: function(e) {
    this.reSetActive();

    e.model.set('item.active', true);
    this.active = true;
    this.fire('navItemDropdown-active', {navItem: this}, {node: e.target});
    e.stopPropagation();
  },
  hasClass: function(element, className) {
    return element.className.split(' ').indexOf(className) > -1;
  },
  toggleExpand: function(e) {
    e.stopPropagation();
    this.toggleClass('collapsed', this.hasClass(this, 'expanded'));
    this.toggleClass('expanded');
  },
  AddIcon: function(icon) {
    var anchor = document.createElement('a');
    anchor.href = this.location;
    this.appendChild(anchor);
    var SpanIcon = document.createElement('span');
    SpanIcon.classList.add('icon-' + icon);
    anchor.appendChild(SpanIcon);
  },
  dashed: function(text) {
    return (text || '').toLowerCase().split(' ').join('-');
  },
  setActiveClass: function(active) {
    return active ? 'active' : '';
  },
  toggleModeToggler: function(items) {
    this.haveChildren = !!items.length;
  }
});