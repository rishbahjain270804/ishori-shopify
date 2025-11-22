// Ishori Global Functions - Core dependencies for all scripts

// Debounce function for performance optimization
function debounce(fn, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(fn, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  };
}

// Focus trap for modals and drawers
function trapFocus(container, elementToFocus = container) {
  const elements = getFocusableElements(container);
  const first = elements[0];
  const last = elements[elements.length - 1];

  removeTrapFocus();

  container.setAttribute('tabindex', '-1');
  elementToFocus.focus();

  function handleFocusTrap(event) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  document.addEventListener('keydown', handleFocusTrap);
  container._focusTrap = handleFocusTrap;
}

function removeTrapFocus(elementToFocus = null) {
  const container = document.querySelector('[tabindex="-1"]');
  if (container && container._focusTrap) {
    document.removeEventListener('keydown', container._focusTrap);
    delete container._focusTrap;
  }

  if (elementToFocus) elementToFocus.focus();
}

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'summary, a[href], button:enabled, [tabindex]:not([tabindex^="-"]), input:not([type="hidden"]):enabled, select:enabled, textarea:enabled'
    )
  );
}

// Fetch configuration
function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': `application/${type}`
    }
  };
}

// Cart utilities
class IshoriCart {
  static getCart() {
    return fetch('/cart.js')
      .then(response => response.json());
  }

  static addToCart(items) {
    return fetch('/cart/add.js', {
      ...fetchConfig('json'),
      body: JSON.stringify({ items })
    }).then(response => response.json());
  }

  static updateCart(updates) {
    return fetch('/cart/update.js', {
      ...fetchConfig('json'),
      body: JSON.stringify({ updates })
    }).then(response => response.json());
  }

  static changeCart(line, quantity) {
    return fetch('/cart/change.js', {
      ...fetchConfig('json'),
      body: JSON.stringify({ line, quantity })
    }).then(response => response.json());
  }
}

// Modal Dialog Component
class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]')?.addEventListener('click', this.hide.bind(this));
    this.addEventListener('keyup', (event) => {
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });
  }

  show(opener) {
    this.openedBy = opener;
    document.body.classList.add('overflow-hidden');
    this.setAttribute('open', '');
    trapFocus(this, this.querySelector('[role="dialog"]'));
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    this.removeAttribute('open');
    removeTrapFocus(this.openedBy);
  }
}

customElements.define('modal-dialog', ModalDialog);

// Details Disclosure Component
class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle?.querySelector('summary')?.nextElementSibling;

    this.mainDetailsToggle?.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle?.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content?.getAnimations();
    
    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations?.forEach(animation => animation.play());
    } else {
      this.animations?.forEach(animation => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle?.removeAttribute('open');
    this.mainDetailsToggle?.querySelector('summary')?.setAttribute('aria-expanded', 'false');
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

// Menu Drawer Component
class MenuDrawer extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    
    this.addEventListener('keyup', (event) => {
      if (event.code.toUpperCase() === 'ESCAPE') {
        this.close();
      }
    });

    this.mainDetailsToggle?.querySelector('summary')?.addEventListener('click', this.onSummaryClick.bind(this));
  }

  onSummaryClick(event) {
    const isOpen = this.mainDetailsToggle.hasAttribute('open');
    
    if (isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    document.body.classList.add('overflow-hidden');
    this.mainDetailsToggle.setAttribute('open', '');
    trapFocus(this.mainDetailsToggle);
  }

  close() {
    document.body.classList.remove('overflow-hidden');
    this.mainDetailsToggle?.removeAttribute('open');
    removeTrapFocus();
  }
}

customElements.define('menu-drawer', MenuDrawer);

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('✅ Ishori Theme Loaded');
}
