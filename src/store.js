import Vue from 'vue'
import Vuex from 'vuex'
import api from './api.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 学生列表
    stuList: [],
    page: 1,
    size: 10,
    // 遮罩层
    showModel: false,
     // 点击编辑对应的学生信息
    editUser: {},
    // 总条数
    total: 0,
    // 搜索关键字
    keyWord: ''
  },
  mutations: {
    // this.$store.commit('setStuList')
    setStuList(state, list) {
      state.stuList = list
    },
    setShowModel(state, bool) {
      state.showModel = bool
    },
    setEditUser(state, user = {}) {
      state.editUser = user
    },
    setTotal(state, cont) {
      state.total = cont
    },
    setKeyword(state, word='') {
      state.keyWord = word
    }
  },
  actions: {
    getStuList({commit, state, dispatch}, page = 1) {
      //如果搜索框不为空，
      if(state.keyWord !== '') {
        dispatch('searchStu', page)
      } else {
        return api
        .findByPage(page)
        .then(data => {
           commit('setStuList', data.data.data.findByPage)
           commit('setTotal', data.data.data.cont)
        })
        .catch(err => console.log(err))
      }
    },
    // 修改学生信息
    updateStu({commit, state}, data) {
      return api
        .updateStu(data)
        .then(msg => {
          if(msg.data.status == 'success') {
            Object.assign(state.editUser, data)
            commit('setShowModel',false)
            commit('setEditUser')
            return msg.data.msg
          } else {
            return Promise.reject(msg.data.msg)
          }
        })
    },
    // 删除学生信息
    delBySno({dispatch}, sNo) {
      api
        .delBySno(sNo)
        .then(() => {
          dispatch('getStuList')
          alert('删除成功')
        })
    },
    // 关键字搜索
    searchStu({state, commit}, page) {
      api
        .stuSearch(state.keyWord, page) 
        .then(data => {
          commit('setTotal', data.data.data.cont)
          commit('setStuList', data.data.data.searchList)
        })
    }
  }
})
