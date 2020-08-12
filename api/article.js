import { request } from '@/plugins/request'

// 获取公共文章列表
export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params,
  })
}

// my feed
export const getYourFeedArticles = (params) => {
  return request({
    method: 'GET',
    url: '/api/articles/feed',
    params,
  })
}

// add likes
export const addFavorite = (slug) => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}/favorite`,
  })
}

// delete likes
export const deleteFavorite = (slug) => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}/favorite`,
  })
}

// get article detail
export const getArticleDetail = (slug) => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}`,
  })
}

// get article comments
export const getArticleComments = (slug) => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}/comments`,
  })
}
