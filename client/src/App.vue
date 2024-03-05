<!-- App.vue -->
<template>
  <body>
    <div class="flex justify-center items-center text-center flex-col p-10">
      <h1 class="text-3xl font-medium mb-32">URL Shortener</h1>
      <form class="mb-32" action="#">
        <input
          v-model="longUrl"
          class="mr-5 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter your long URL"
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
      </form>
      <div class="flex text-center items-center justify-center">
        <p class="text-xl mr-5" v-if="shortenedUrl">
          <a :href="getFullUrl(shortenedUrl)" target="_blank">
            http://localhost:5000/{{ shortenedUrl }}
          </a>
        </p>
      </div>
      <p v-if="error" style="color: red">Error: {{ error }}</p>
      <div class="flex text-center items-center justify-center">
        <ul class="text-xl mr-5">
          <li v-for="url in storedUrls" :key="url.shortUrl">
            <a :href="getFullUrl(url.shortUrl)" target="_blank">
              http://localhost:5000/{{ url.shortUrl }}
            </a>
          </li>
        </ul>
        <button
          @click="clearStoredUrls"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Clear All
        </button>
      </div>
    </div>
  </body>
</template>

<script>
import "./assests/css/tailwind.css";
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
    clearStoredUrls() {
      // Clear all stored URLs in localStorage
      localStorage.removeItem("storedUrls");
      // Clear the displayed URLs in the component
      this.shortenedUrl = "";
      this.error = null;
    },
  },
};
</script>

<style>
body {
  font-family: "Montserrat";
  background-color: #fbeec1;
}
</style>
