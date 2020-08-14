<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <article-meta :article="article" />
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body" />
      </div>

      <hr />

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <article-comments :article="article" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleDetail } from '@/api/article'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/article-mata'
import ArticleComments from './components/article-comments'
import { mapState } from 'vuex'

export default {
  name: 'ArticleIndex',
  computed: {
    ...mapState(['user']),
  },
  async asyncData({ params }) {
    try {
      const { data } = await getArticleDetail(params.slug)
      const { article } = data
      const md = new MarkdownIt()
      article.body = md.render(article.body)
      return {
        article,
      }
    } catch (error) {
      console.log('error: ', error)
      return {
        article: {
          author: { username: '', bio: '', image: '' },
          body: '',
          createdAt: '',
          description: '',
          favorited: false,
          favoritesCount: 0,
          slug: '',
          tagList: [],
          title: '',
          updatedAt: '',
        },
      }
    }
  },
  components: {
    ArticleMeta,
    ArticleComments,
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description,
        },
      ],
    }
  },
}
</script>

<style></style>
