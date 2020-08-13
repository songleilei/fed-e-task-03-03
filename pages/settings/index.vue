<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <fieldset>
            <fieldset class="form-group">
              <input
                class="form-control"
                type="text"
                placeholder="URL of profile picture"
                v-model="user.image"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="user.username"
              />
            </fieldset>
            <fieldset class="form-group">
              <textarea
                class="form-control form-control-lg"
                rows="8"
                placeholder="Short bio about you"
                v-model="user.bio"
              ></textarea>
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Email"
                v-model="user.email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="user.password"
              />
            </fieldset>
            <button
              class="btn btn-lg btn-primary pull-xs-right"
              @click="updateUser"
            >
              Update Settings
            </button>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateUser } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'authenticated',
  name: 'SettingsIndex',
  computed: {
    ...mapGetters(['currentUser']),
  },
  data() {
    return {
      user: { image: '', email: '', username: '', bio: '', password: '' },
    }
  },
  mounted() {
    const { image, email, username, bio, password } = this.currentUser
    this.user = { image, email, username, bio, password }
  },
  methods: {
    updateUser() {
      updateUser(this.user).then((res) => {
        console.log('res: ', res)
        // 更新user
        // 保存用户的登录状态
        this.$store.commit('setUser', res.data.user)

        // 为了防止刷新页面数据丢失，我们需要把数据持久化
        Cookie.set('user', res.data.user)
      })
    },
  },
}
</script>

<style></style>
