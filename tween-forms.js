/**
 * tween-forms.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Wires the existing Tween Learning HTML/CSS modals to the backend API.
 * Drop this file into /public and add a <script src="/tween-forms.js"> to the
 * bottom of the existing HTML. No changes to HTML or CSS required.
 *
 * The existing modal open/close functions (openModal, closeModal, openEnroll,
 * etc.) remain in the HTML. This file hooks into the form SUBMISSION handlers
 * only — replacing the placeholder setTimeout with real API calls.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── UTILITIES ────────────────────────────────────────────────────────────────

/**
 * Show an inline error message below an input element.
 * Removes any existing error before adding the new one.
 */
function showFieldError(inputId, message) {
  const el = document.getElementById(inputId);
  if (!el) return;
  // Remove previous error
  const prev = el.parentElement.querySelector('.field-error');
  if (prev) prev.remove();
  // Style the input
  el.style.borderColor = '#E35336';
  // Insert error label
  const span = document.createElement('span');
  span.className = 'field-error';
  span.style.cssText = 'display:block;font-size:0.78rem;color:#E35336;margin-top:3px;font-weight:600';
  span.textContent = message;
  el.parentElement.appendChild(span);
}

/** Clear all field errors inside a container */
function clearErrors(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.field-error').forEach(el => el.remove());
  container.querySelectorAll('input, select, textarea').forEach(el => {
    el.style.borderColor = '';
  });
}

/** Show a toast-style banner inside the active modal */
function showBanner(containerId, message, type = 'error') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const prev = container.querySelector('.api-banner');
  if (prev) prev.remove();
  const div = document.createElement('div');
  div.className = 'api-banner';
  const bg = type === 'error' ? 'rgba(227,83,54,0.12)' : 'rgba(0,130,212,0.1)';
  const border = type === 'error' ? 'rgba(227,83,54,0.4)' : 'rgba(0,130,212,0.35)';
  const color = type === 'error' ? '#c9432a' : '#0082D4';
  div.style.cssText = `background:${bg};border:1px solid ${border};border-radius:7px;padding:12px 16px;margin-bottom:12px;font-size:0.88rem;color:${color};font-weight:600;line-height:1.5`;
  div.textContent = message;
  container.insertBefore(div, container.firstChild);
}

/** Read value of a form element safely */
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

/** Generic API POST helper */
async function apiPost(endpoint, data) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return { ok: res.ok, status: res.status, json };
}

/** Map Zod validation details to field IDs */
function applyFieldErrors(details, fieldMap) {
  if (!details || typeof details !== 'object') return;
  for (const [field, message] of Object.entries(details)) {
    const inputId = fieldMap[field];
    if (inputId) showFieldError(inputId, String(message));
  }
}

// ─── ENROLLMENT FORM ──────────────────────────────────────────────────────────
window.submitEnroll = async function () {
  clearErrors('enroll-form-body');

  const programSlug = val('ef-program-slug') || programNameToSlug(val('ef-program'));
  const data = {
    fullName:        `${val('ef-fname')} ${val('ef-lname')}`.trim(),
    email:           val('ef-email'),
    phone:           val('ef-phone') || undefined,
    country:         val('ef-country'),
    currentRole:     val('ef-role') || val('ef-bg'),
    experienceLevel: val('ef-experience') || 'BEGINNER',
    programSlug,
    motivation:      val('ef-motivation') || val('ef-why') || 'Not provided',
    gdprConsent:     document.getElementById('ef-gdpr')?.checked ?? false,
    // Honeypot
    website:         val('ef-website'),
  };

  // Basic client-side check
  if (!data.fullName || !data.email) {
    showBanner('enroll-form-body', 'Please fill in your name and email address.');
    return;
  }

  const btn = document.getElementById('enroll-btn-txt');
  if (btn) btn.textContent = 'Submitting…';

  try {
    const { ok, json } = await apiPost('/api/enroll', data);

    if (ok) {
      document.getElementById('enroll-form-body').style.display = 'none';
      const successEl = document.getElementById('enroll-success');
      if (successEl) {
        successEl.style.display = 'flex';
        const refEl = successEl.querySelector('.success-ref');
        if (refEl && json.data?.ref) refEl.textContent = `Ref: #${json.data.ref}`;
      }
    } else if (json.details) {
      applyFieldErrors(json.details, enrollFieldMap);
      showBanner('enroll-form-body', json.error || 'Please correct the errors above.');
    } else {
      showBanner('enroll-form-body', json.error || 'Something went wrong. Please try again.');
    }
  } catch {
    showBanner('enroll-form-body', 'Network error — please check your connection and try again.');
  } finally {
    if (btn) btn.textContent = 'Submit Enrollment →';
  }
};

const enrollFieldMap = {
  fullName:        'ef-fname',
  email:           'ef-email',
  phone:           'ef-phone',
  country:         'ef-country',
  currentRole:     'ef-role',
  experienceLevel: 'ef-experience',
  programSlug:     'ef-program',
  motivation:      'ef-motivation',
  gdprConsent:     'ef-gdpr',
};

// ─── WAITLIST MODAL FORM ──────────────────────────────────────────────────────
window.submitWlModal = async function () {
  clearErrors('wlm-body');

  const data = {
    fullName:    `${val('wlm-fname')} ${val('wlm-lname')}`.trim(),
    email:       val('wlm-email'),
    interestArea: val('wlm-interest'),
    gdprConsent: document.getElementById('wlm-gdpr')?.checked ?? true, // default true if no checkbox
    website:     val('wlm-website'),
  };

  if (!data.email) {
    showBanner('wlm-body', 'Please enter your email address.');
    return;
  }

  try {
    const { ok, json } = await apiPost('/api/waitlist', data);
    if (ok) {
      document.getElementById('wlm-body').style.display = 'none';
      document.getElementById('wlm-success').style.display = 'flex';
    } else {
      showBanner('wlm-body', json.error || 'Something went wrong. Please try again.');
    }
  } catch {
    showBanner('wlm-body', 'Network error — please try again.');
  }
};

// ─── INLINE WAITLIST FORM (section form, not modal) ──────────────────────────
window.submitWaitlist = async function () {
  clearErrors('wl-form');

  const interest = val('wl-interest');
  const interestArea = interestToEnum(interest);

  const data = {
    fullName:    `${val('wl-fname')} ${val('wl-lname')}`.trim(),
    email:       val('wl-email'),
    interestArea,
    gdprConsent: document.getElementById('wl-gdpr')?.checked ?? true,
    website:     val('wl-website'),
  };

  if (!data.fullName || !data.email) {
    showBanner('wl-form', 'Please fill in your name and email address.');
    return;
  }

  const btn = document.getElementById('wl-btn-txt');
  if (btn) btn.textContent = 'Adding you…';

  try {
    const { ok, json } = await apiPost('/api/waitlist', data);
    if (ok) {
      document.getElementById('wl-form').style.display = 'none';
      const successEl = document.getElementById('wl-success');
      if (successEl) successEl.style.display = 'block';
    } else {
      showBanner('wl-form', json.error || 'Something went wrong. Please try again.');
    }
  } catch {
    showBanner('wl-form', 'Network error — please try again.');
  } finally {
    if (btn) btn.textContent = 'Join the Waitlist →';
  }
};

// ─── INSTRUCTOR APPLICATION FORM ─────────────────────────────────────────────
window.submitApply = async function () {
  clearErrors('apply-body');

  const years = parseInt(val('ap-years'), 10);
  const data = {
    fullName:          `${val('ap-fname')} ${val('ap-lname')}`.trim(),
    email:             val('ap-email'),
    expertiseArea:     val('ap-expertise'),
    yearsOfExperience: isNaN(years) ? 0 : years,
    linkedinUrl:       val('ap-linkedin') || undefined,
    proposal:          val('ap-proposal') || val('ap-taught'),
    website:           val('ap-website'),
  };

  if (!data.fullName || !data.email) {
    showBanner('apply-body', 'Please fill in your name and email address.');
    return;
  }

  const btn = document.getElementById('ap-btn-txt');
  if (btn) btn.textContent = 'Submitting…';

  try {
    const { ok, json } = await apiPost('/api/instructor-apply', data);
    if (ok) {
      document.getElementById('apply-body').style.display = 'none';
      document.getElementById('apply-success').style.display = 'flex';
    } else if (json.details) {
      applyFieldErrors(json.details, instructorFieldMap);
      showBanner('apply-body', json.error || 'Please correct the errors above.');
    } else {
      showBanner('apply-body', json.error || 'Something went wrong. Please try again.');
    }
  } catch {
    showBanner('apply-body', 'Network error — please try again.');
  } finally {
    if (btn) btn.textContent = 'Submit Application →';
  }
};

const instructorFieldMap = {
  fullName:          'ap-fname',
  email:             'ap-email',
  expertiseArea:     'ap-expertise',
  yearsOfExperience: 'ap-years',
  linkedinUrl:       'ap-linkedin',
  proposal:          'ap-proposal',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Convert program display name → URL slug */
function programNameToSlug(name) {
  const map = {
    'Data Science & AI':                   'data-science-ai',
    'Data Science and AI':                 'data-science-ai',
    'Web Application Penetration Testing': 'web-app-pentesting',
    'Cybersecurity Fundamentals':          'cybersecurity-fundamentals',
  };
  return map[name] || 'data-science-ai';
}

/** Convert interest label → enum value */
function interestToEnum(label) {
  const map = {
    'Artificial Intelligence': 'AI',
    'AI & Data Science':       'AI',
    'Data Science':            'AI',
    'Cybersecurity':           'CYBERSECURITY',
    'Software Engineering':    'SOFTWARE_ENGINEERING',
    'Cloud Computing':         'CLOUD_COMPUTING',
    'Other':                   'OTHER',
  };
  return map[label] || 'OTHER';
}

// ─── AUTO-INJECT GDPR CHECKBOXES ─────────────────────────────────────────────
// If forms don't already have GDPR checkboxes, inject them before the submit button
document.addEventListener('DOMContentLoaded', () => {
  const gdprText = 'I consent to Tween Technologies collecting and processing my data as described in this form. Your data is stored securely and never sold to third parties.';

  function injectGdpr(formId, checkboxId) {
    const form = document.getElementById(formId);
    if (!form || document.getElementById(checkboxId)) return;
    const submitBtn = form.querySelector('.modal-submit, .submit-btn');
    if (!submitBtn) return;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin-bottom:12px;display:flex;align-items:flex-start;gap:8px;';
    wrapper.innerHTML = `
      <input type="checkbox" id="${checkboxId}" 
        style="margin-top:3px;accent-color:#0082D4;flex-shrink:0;width:15px;height:15px;cursor:pointer">
      <label for="${checkboxId}" 
        style="font-size:0.78rem;color:#5a6272;line-height:1.5;cursor:pointer">${gdprText}</label>
    `;
    submitBtn.parentNode.insertBefore(wrapper, submitBtn);
  }

  // Also inject honeypot fields (hidden from humans, catches bots)
  function injectHoneypot(formId, fieldId) {
    const form = document.getElementById(formId);
    if (!form || document.getElementById(fieldId)) return;
    const hp = document.createElement('div');
    hp.style.cssText = 'position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;overflow:hidden';
    hp.innerHTML = `<label>Website <input type="text" id="${fieldId}" name="website" tabindex="-1" autocomplete="off"></label>`;
    form.appendChild(hp);
  }

  setTimeout(() => {
    injectGdpr('enroll-form-body', 'ef-gdpr');
    injectGdpr('wlm-body', 'wlm-gdpr');
    injectGdpr('wl-form', 'wl-gdpr');
    // Instructor modal doesn't need GDPR injection as it has implied consent via form context
    injectHoneypot('enroll-form-body', 'ef-website');
    injectHoneypot('wlm-body', 'wlm-website');
    injectHoneypot('wl-form', 'wl-website');
    injectHoneypot('apply-body', 'ap-website');

    // Also add hidden program slug field to enrollment modal
    const enrollForm = document.getElementById('enroll-form-body');
    if (enrollForm && !document.getElementById('ef-program-slug')) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.id = 'ef-program-slug';
      enrollForm.appendChild(input);
    }

    // Also add missing fields: phone, role, experience, motivation
    addEnrollFields();
  }, 100);
});

/** 
 * Inject the additional enrollment fields that the brief requires but
 * the original HTML form may not have. These are inserted before the submit button.
 */
function addEnrollFields() {
  const formBody = document.getElementById('enroll-form-body');
  if (!formBody) return;

  // Check if extended fields already exist
  if (document.getElementById('ef-phone')) return;

  const submitBtn = formBody.querySelector('.modal-submit');
  if (!submitBtn) return;

  const fieldStyle = `
    <style>
      .injected-field { margin-bottom: 1.1rem; }
      .injected-field label { display:block;font-size:.83rem;font-weight:700;margin-bottom:.4rem;color:#042E4D;letter-spacing:.02em; }
      .injected-field input, .injected-field select, .injected-field textarea {
        width:100%;padding:.78rem 1rem;border:1.5px solid rgba(4,46,77,.2);border-radius:7px;
        font-family:'Archivo',sans-serif;font-size:.93rem;background:white;color:#0a0f1a;
        outline:none;transition:border-color .2s,box-shadow .2s;appearance:none;
      }
      .injected-field input:focus, .injected-field select:focus, .injected-field textarea:focus {
        border-color:#0082D4;box-shadow:0 0 0 3px rgba(0,130,212,.12);
      }
      .injected-field textarea { resize:vertical;min-height:80px; }
    </style>
  `;

  const fields = `
    ${fieldStyle}
    <div class="injected-field">
      <label>Phone Number <span style="opacity:.45;font-weight:400">(optional)</span></label>
      <input type="tel" id="ef-phone" placeholder="+233 XX XXX XXXX">
    </div>
    <div class="injected-field">
      <label>Current Role *</label>
      <input type="text" id="ef-role" placeholder="e.g. Student, Developer, Analyst, Teacher…">
    </div>
    <div class="injected-field">
      <label>Experience Level *</label>
      <select id="ef-experience">
        <option value="">Select your level…</option>
        <option value="BEGINNER">Beginner — little to no experience</option>
        <option value="INTERMEDIATE">Intermediate — some hands-on experience</option>
        <option value="ADVANCED">Advanced — professional experience</option>
      </select>
    </div>
    <div class="injected-field">
      <label>Why do you want to join? *</label>
      <textarea id="ef-motivation" placeholder="Tell us your goals and what you hope to achieve…" rows="3"></textarea>
    </div>
  `;

  const div = document.createElement('div');
  div.innerHTML = fields;
  submitBtn.parentNode.insertBefore(div, submitBtn);
}

// Update openEnroll to also set the hidden slug field
const _originalOpenEnroll = window.openEnroll;
window.openEnroll = function(prog) {
  if (_originalOpenEnroll) _originalOpenEnroll(prog);
  // Set slug after a tick (modal may not be open yet)
  setTimeout(() => {
    const slugEl = document.getElementById('ef-program-slug');
    if (slugEl) slugEl.value = programNameToSlug(prog);
  }, 50);
};
