<script setup>
import { ref } from 'vue';

const columns = [
  {
    title: 'About Tripote-visor',
    links: [
      'About Us', 'Press', 'Resources and Policies', 'Careers', 'Investor Relations',
      'Trust & Safety', 'Contact us', 'Bug Bounty Program', 'Tripote-visor Technology Blog',
    ],
  },
  {
    title: 'Explore',
    links: ['Write a review', 'Add a Place', 'Join', "Travelers' Choice", 'Help Center', 'Travel Stories'],
  },
  {
    title: 'Do Business With Us',
    links: [
      'Owners', 'Business Advantage', 'Sponsored Placements', 'Advertise with Us',
      'Access our Content API', 'Become an Affiliate',
    ],
    extraTitle: 'Get The App',
    extraLinks: ['iPhone App', 'Android App'],
  },
];

const sites = [
  { label: 'Book the best restaurants with', partner: 'TheFork' },
  { label: 'Book tours and attraction tickets on', partner: 'Viator' },
  { label: 'Read cruise reviews on', partner: 'Cruise Critic' },
];

const currency = ref('$ USD');
const country = ref('United States');

const socials = [
  { id: 'fb', label: 'Facebook' },
  { id: 'x', label: 'X' },
  { id: 'pi', label: 'Pinterest' },
  { id: 'ig', label: 'Instagram' },
  { id: 'yt', label: 'YouTube' },
  { id: 'tt', label: 'TikTok' },
];

const readMore = ref(false);
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div v-for="col in columns" :key="col.title" class="footer-col">
          <h3>{{ col.title }}</h3>
          <ul>
            <li v-for="l in col.links" :key="l"><a href="#">{{ l }}</a></li>
          </ul>
          <template v-if="col.extraTitle">
            <h3 class="mt">{{ col.extraTitle }}</h3>
            <ul>
              <li v-for="l in col.extraLinks" :key="l"><a href="#">{{ l }}</a></li>
            </ul>
          </template>
        </div>

        <div class="footer-col sites-col">
          <h3>Tripote-visor Sites</h3>
          <ul>
            <li v-for="s in sites" :key="s.partner">
              {{ s.label }} <a href="#" class="partner">{{ s.partner }}</a>
            </li>
          </ul>

          <div class="selects">
            <select v-model="currency" aria-label="Currency">
              <option>$ USD</option>
              <option>€ EUR</option>
              <option>£ GBP</option>
            </select>
            <select v-model="country" aria-label="Country">
              <option>United States</option>
              <option>France</option>
              <option>United Kingdom</option>
            </select>
          </div>

          <div class="socials" aria-label="Social links">
            <a v-for="s in socials" :key="s.id" href="#" :aria-label="s.label" class="social">
              <span class="social-dot">{{ s.label[0] }}</span>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="owl-wrap">
          <svg class="owl" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="var(--brand-dark)" stroke-width="2" />
            <circle cx="14" cy="18" r="4" fill="var(--brand-dark)" />
            <circle cx="26" cy="18" r="4" fill="var(--brand-dark)" />
            <circle cx="14" cy="18" r="1.5" fill="#fff" />
            <circle cx="26" cy="18" r="1.5" fill="#fff" />
          </svg>
          <span class="copyright">© 2026 Tripote-visor LLC All rights reserved.</span>
        </div>

        <nav class="legal">
          <a href="#">Terms of Use</a>
          <a href="#">Privacy and Cookies Statement</a>
          <a href="#">Cookie consent</a>
          <a href="#">How the site works</a>
          <a href="#">Contact us</a>
          <a href="#">Accessibility Statement</a>
        </nav>

        <p class="disclaimer">
          This is a parody website for educational/front-end demonstration purposes only.
          Tripote-visor is not affiliated with any real travel platform.
          <template v-if="readMore">
            All content, logos, and layouts shown here are placeholders. No actual bookings,
            reviews, or user data are handled. Images are sourced from free stock photo services.
          </template>
          <button class="read-more" @click="readMore = !readMore">
            {{ readMore ? 'Read less ▴' : 'Read more ▾' }}
          </button>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--surface);
  padding: 40px 0 24px;
  margin-top: 40px;
  font-size: 13px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.footer-col h3 {
  color: var(--brand-dark);
  font-size: 14px;
  font-weight: 800;
  margin: 0 0 12px 0;
}

.footer-col h3.mt {
  margin-top: 22px;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-col a {
  color: var(--text);
}

.footer-col a:hover {
  text-decoration: underline;
}

.partner {
  font-weight: 700;
  text-decoration: underline;
}

.selects {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
}

.selects select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #fff;
  font-size: 13px;
  font-family: inherit;
}

.socials {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

.social {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--brand-dark);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

.social-dot {
  color: #fff;
}

.footer-bottom {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.owl-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.owl {
  width: 28px;
  height: 28px;
}

.copyright {
  font-size: 13px;
  color: var(--text);
}

.legal {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 13px;
}

.legal a {
  text-decoration: underline;
}

.disclaimer {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

.read-more {
  color: var(--brand-dark);
  font-weight: 700;
  padding: 0 4px;
  font-size: 12px;
}

@media (max-width: 900px) {
  .footer-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
