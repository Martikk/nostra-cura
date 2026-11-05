import Footer from '../components/layout/Footer';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
  return <>
    <main className="privacy-page" id="main-content">
      <article>
        <h1>Privacy Policy</h1>
        <p className="privacy-page__updated">Last updated: November 4, 2026</p>
        <p>This policy explains how Nostra Cura Consulting Group Inc. (NCCG) handles information when you visit nccg.ca or contact us through this website.</p>
        <h2>Information we collect</h2>
        <p>Contact forms collect your name, email address, optional phone number and the message you choose to send. Please include only information relevant to your enquiry. Do not send medical records, financial account details, passwords or other highly sensitive information through the form.</p>
        <p>Our infrastructure providers may process technical information, such as your IP address, browser, requested pages and request times, to deliver the website, troubleshoot problems and prevent abuse.</p>
        <h2>How we use information</h2>
        <p>We use your contact details and message to respond to your enquiry, discuss our services and follow up on your request. Submitting a form does not subscribe you to a marketing mailing list.</p>
        <h2>Services that process information</h2>
        <ul>
          <li><strong>Netlify</strong> hosts the website and runs the server function that validates and processes contact requests and applies rate limits. <a href="https://www.netlify.com/privacy/">Netlify privacy information</a>.</li>
          <li><strong>Resend</strong> delivers form messages to our business email addresses. It processes message content, recipient details, your reply-to email address and delivery events. <a href="https://resend.com/legal/privacy-policy">Resend privacy information</a>.</li>
          <li><strong>Microsoft 365</strong> provides our business email service, where enquiry emails and subsequent correspondence may be stored. <a href="https://privacy.microsoft.com/privacystatement">Microsoft privacy information</a>.</li>
          <li><strong>Cloudinary</strong> delivers website images. Image requests may include technical information such as your IP address and browser details.</li>
        </ul>
        <p>The main form sends enquiries to <a href="mailto:info@nccg.ca">info@nccg.ca</a>; the Liam page sends them to <a href="mailto:liam@nccg.ca">liam@nccg.ca</a>. Current submissions are delivered by email rather than stored as new submissions in Netlify Forms. Older submissions made through the previous form system may remain in that dashboard.</p>
        <p>Service providers may process information outside Canada, including in the United States, where different privacy laws may apply.</p>
        <h2>Browser storage and external links</h2>
        <p>The Liam page remembers your light or dark appearance preference in your browser’s local storage. You can remove it by clearing this website’s stored data. It is not included in contact messages.</p>
        <p>External websites, including social media services, have their own privacy practices. This policy applies to the NCCG website.</p>
        <h2>Retention and security</h2>
        <p>Enquiry correspondence is retained as needed to respond, maintain relevant business records and meet applicable obligations. Providers maintain their own delivery logs, backups and retention settings; deleting an email may not immediately remove every provider-held copy.</p>
        <p>We use HTTPS for website connections and keep the email service API key on the server. No internet transmission or storage system can be guaranteed completely secure.</p>
        <h2>Your choices and privacy questions</h2>
        <p>You can choose not to submit a form. To ask about information you have provided, request access or correction, request deletion, or ask us to stop further follow-up, email <a href="mailto:info@nccg.ca">info@nccg.ca</a>. We may need to verify your identity. Some information may need to be retained for legal or business-record purposes.</p>
        <p>We may update this policy when the website or our information-handling practices change. The date above identifies the latest version.</p>
        <a className="privacy-page__back" href="/">Back to NCCG</a>
      </article>
    </main>
    <Footer />
  </>;
}
