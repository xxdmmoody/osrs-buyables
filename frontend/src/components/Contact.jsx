import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paperclip, X, Loader2, CheckCircle } from 'lucide-react';
import { sendContactForm } from '../services/api';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    body: '',
  });
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('subject', formData.subject);
      payload.append('body', formData.body);
      attachments.forEach((file) => payload.append('screenshots', file));

      await sendContactForm(payload);
      setSent(true);
    } catch (err) {
      const errorData = err.response?.data?.error;
      const message = typeof errorData === 'string'
        ? errorData
        : errorData?.message || 'Failed to send message. Please try again later.';
      setError(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          <img
            src="https://oldschool.runescape.wiki/images/Teleport_to_House.png"
            alt="Teleport to House"
            className="w-5 h-5"
            style={{ imageRendering: 'pixelated' }}
          />
          Dashboard
        </button>
      </div>

      <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg p-8">
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
          Contact Us
        </h2>
        <p className="text-sm text-light-muted dark:text-dark-muted mb-6">
          Have feedback, found a bug, or want to suggest a feature? Let us know!
        </p>

        {sent ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
              Message Sent!
            </h3>
            <p className="text-light-muted dark:text-dark-muted mb-6">
              Thanks for reaching out. We'll get back to you as soon as we can.
            </p>
            <button
              onClick={() => {
                setSent(false);
                setFormData({ name: '', email: '', subject: '', body: '' });
                setAttachments([]);
              }}
              className="px-4 py-2 text-sm bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={sending}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-accent disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={sending}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-accent disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={sending}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-accent disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
              >
                Message
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
                disabled={sending}
                rows={6}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-accent resize-vertical disabled:opacity-50"
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                Screenshots (optional)
              </label>
              <label className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-muted dark:text-dark-muted hover:bg-light-hover dark:hover:bg-dark-hover cursor-pointer transition-colors ${sending ? 'opacity-50 pointer-events-none' : ''}`}>
                <Paperclip className="w-4 h-4" />
                Attach files
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={sending}
                  className="hidden"
                />
              </label>

              {attachments.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between px-3 py-2 text-sm rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border"
                    >
                      <span className="text-light-text dark:text-dark-text truncate mr-2">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        disabled={sending}
                        className="text-light-muted dark:text-dark-muted hover:text-red-500 dark:hover:text-red-400 flex-shrink-0 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full px-4 py-2.5 bg-[#5c4a2f] dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-[#4a3b25] dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
