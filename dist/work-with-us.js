const applicationForm = document.querySelector('#application-form');
const applicationNote = document.querySelector('#application-note');
const applicationButton = applicationForm?.querySelector('button[type="submit"]');

const getSweetAlert = () => {
  if (window.Swal) return Promise.resolve(window.Swal);
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-sweetalert]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.Swal), { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11.26.25/dist/sweetalert2.all.min.js';
    script.async = true;
    script.dataset.sweetalert = '';
    script.addEventListener('load', () => resolve(window.Swal), { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.append(script);
  });
};

const applicationAlert = applicationForm ? getSweetAlert().catch(() => null) : Promise.resolve(null);

applicationForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const Swal = await applicationAlert;
  if (applicationButton) applicationButton.disabled = true;
  if (applicationNote) applicationNote.textContent = 'Sending your application...';

  if (Swal) {
    Swal.fire({
      title: 'Sending application',
      text: 'Please wait while we contact the OMA team.',
      background: '#f1eee7',
      color: '#0a0a0a',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });
  }

  try {
    const response = await fetch('api/send-application.php', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(applicationForm)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.message || 'Unable to send your application.');

    applicationForm.reset();
    const successMessage = result.message || 'Your application was sent successfully. The OMA team will review it soon.';
    if (applicationNote) applicationNote.textContent = successMessage;
    if (Swal) {
      await Swal.fire({ icon: 'success', title: 'Application sent', text: successMessage, confirmButtonText: 'Done', confirmButtonColor: '#0a0a0a', background: '#f1eee7', color: '#0a0a0a' });
    } else {
      window.alert(successMessage);
    }
  } catch (error) {
    const errorMessage = `${error.message} Please email or call OMA Tattoo instead.`;
    if (applicationNote) applicationNote.textContent = errorMessage;
    if (Swal) {
      await Swal.fire({ icon: 'error', title: 'Application not sent', text: errorMessage, confirmButtonText: 'Try again', confirmButtonColor: '#0a0a0a', background: '#f1eee7', color: '#0a0a0a' });
    } else {
      window.alert(errorMessage);
    }
  } finally {
    if (applicationButton) applicationButton.disabled = false;
  }
});
