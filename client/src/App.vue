<!-- App.vue -->
<template>
  <div className="container">
    <h1>URL Shortener</h1>
    <input
      v-model="longUrl"
      placeholder="Enter your long URL"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id="url"
      type="text"
    />
    <button
      @click="shortenUrl"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      type="button"
    >
      Shorten
    </button>
    <p v-if="shortenedUrl">
      <a :href="getFullUrl(shortenedUrl)" target="_blank">
        http://localhost:5000/{{ shortenedUrl }}
      </a>
    </p>
    <p v-if="error" style="color: red">Error: {{ error }}</p>
    <div>
      <h2>Saved URLs</h2>
      <ul>
        <li v-for="url in storedUrls" :key="url.shortUrl">
          <a :href="getFullUrl(url.shortUrl)" target="_blank">
            http://localhost:5000/{{ url.shortUrl }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import "./assets/styles/main.css";
export default {
  data() {
    return {
      longUrl: "",
      shortenedUrl: "",
      error: null,
    };
  },
  computed: {
    storedUrls() {
      return JSON.parse(localStorage.getItem("storedUrls")) || [];
    },
  },
  methods: {
    async shortenUrl() {
      try {
        const response = await fetch("http://localhost:5000/api/shorten", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ originalUrl: this.longUrl }),
        });

        const data = await response.json();

        if (response.ok) {
          this.shortenedUrl = data.shortUrl;
          this.error = null;

          // Save the URL in localStorage
          const storedUrls = this.storedUrls;
          storedUrls.push({
            originalUrl: this.longUrl,
            shortUrl: this.shortenedUrl,
          });
          localStorage.setItem("storedUrls", JSON.stringify(storedUrls));
        } else {
          this.shortenedUrl = "";
          this.error = data.error || "Unknown error";
        }
      } catch (error) {
        console.error(error);
        this.shortenedUrl = "";
        this.error = "Failed to connect to the server";
      }
    },
    getFullUrl(shortenedUrl) {
      return `http://localhost:5000/${shortenedUrl}`;
    },
  },
};
</script>

<style>
.container {
  font-family: "Montserrat";
}
</style>
