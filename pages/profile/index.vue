<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="user.image" class="user-img" />
            <h4>{{ user.username }}</h4>
            <p>
              {{ user.bio }}
            </p>
            <nuxt-link
              class="btn btn-sm btn-outline-secondary action-btn"
              to="/settings"
              >Edit Profile Settings</nuxt-link
            >
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tab === 'my_feed' }"
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'my_feed',
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: tab === 'favorite_feed' }"
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorite_feed',
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  class="author"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{
                  article.createdAt | date('MMM DD, YYYY')
                }}</span>
              </div>

              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                @click="onFavorite(article)"
                :disabled="article.loading"
              >
                <i class="ion-heart"></i>
                {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  class="tag-default tag-pill tag-outline"
                  v-for="tag in article.tagList"
                  :key="tag"
                >
                  {{ tag }}
                </li>
              </ul>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ active: item === page }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'profile',
                    query: {
                      page: item,
                      tab: tab,
                    },
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, addFavorite } from '@/api/article'
import { mapState } from 'vuex'
export default {
  middleware: 'authenticated',
  name: 'ProfileIndex',
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    },
  },
  data() {
    return {
      articles: [],
      articlesCount: 0,
      tab: 'my_feed',
      limit: 5,
      page: 1,
    }
  },
  async mounted() {
    const { query } = this.$route
    this.page = Number.parseInt(query.page || 1)
    this.tab = query.tab || 'my_feed'
    const page = Number.parseInt(query.page || 1)
    const tab = query.tab || 'my_feed'
    const params = {
      limit: this.limit,
      offset: (page - 1) * this.limit,
    }

    const lastParms =
      tab === 'my_feed'
        ? { ...params, author: this.user.username }
        : { ...params, favorited: this.user.username }

    const articleRes = await getArticles(lastParms)

    console.log('articleRes: ', articleRes)

    const { articles, articlesCount } = articleRes.data
    articles.forEach((article) => {
      article.loading = false
    })
    this.articles = articles
    this.articlesCount = articlesCount
  },
  watch: {
    async $route(to) {
      const { query } = to
      const page = Number.parseInt(query.page || 1)
      this.page = Number.parseInt(query.page || 1)
      this.tab = query.tab || 'my_feed'
      const tab = query.tab || 'my_feed'
      const params = {
        limit: this.limit,
        offset: (page - 1) * this.limit,
      }

      const lastParms =
        tab === 'my_feed'
          ? { ...params, author: this.user.username }
          : { ...params, favorited: this.user.username }

      const articleRes = await getArticles(lastParms)
      const { articles, articlesCount } = articleRes.data
      console.log('articleRes.data: ', articleRes.data)
      articles.forEach((article) => {
        article.loading = false
      })
      this.articles = articles
      this.articlesCount = articlesCount
    },
  },
  methods: {
    async onFavorite(article) {
      article.loading = true
      if (article.favorited) {
        // 取消点赞
        try {
          await deleteFavorite(article.slug)
          article.favorited = false
          article.favoritesCount -= 1
        } catch (error) {
          console.log('error: ', error)
        }
      } else {
        try {
          await addFavorite(article.slug)
          article.favorited = true
          article.favoritesCount += 1
        } catch (error) {
          console.log('error: ', error)
        }
      }
      article.loading = false
    },
  },
}
</script>

<style></style>
