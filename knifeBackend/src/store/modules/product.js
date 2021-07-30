import { publicAdd as add } from '@/api/imageApi'
import { Message } from 'element-ui'
import { UP_STATUS } from '@/utils/constant'

const product = {
  state: {
    productObj: {},
    tasks: []
  },
  mutations: {
    TOGGLE_PRODUCT_OBJ(state, productObj) {
      sessionStorage.setItem('productObj', JSON.stringify(productObj || {}))
      state.productObj = productObj
    },
    CLEAR_TASKS(state, tasks) {
      state.tasks = tasks
    },
    UPDATE_TASKS(state, form) {
      const tasks = state.tasks
      tasks.push(form)
      state.tasks = tasks
    },
    CHANGE_TASK(state, task) {
      const tasks = state.tasks
      const idIndex = findSame(task, tasks)
      if (idIndex >= 0) {
        tasks.splice(idIndex, 1, task)
      }
      if (idIndex == -1) {
        tasks.push(task)
      }
    },
    TOGGLE_TASK_STAUS(state, form) {
      const tasks = state.tasks
      const idIndex = findSame(form, tasks)
      const { msg, title } = form || {}
      if (idIndex >= 0) {
        tasks[idIndex].status = msg ? '4' : '3'
        Message.success({
          type: msg ? 'danger' : 'success',
          message: `${title}${UP_STATUS[tasks[idIndex].status].label}`
        })
      }
    }
  },
  actions: {
    async ProAdd({ commit }, form) {
      const {
        isShare,
        title,
        name,
        category,
        thumbnail_path,
        raw,
        width,
        height
      } = form || {}

      const formData = new FormData()
      formData.append('path', raw)
      formData.append('title', title)
      formData.append('isShare', isShare)
      formData.append('width', width)
      formData.append('height', height)

      if (category) {
        formData.append('category', category)
      }
      formData.append('thumbnail_path', thumbnail_path, name)
      commit('UPDATE_TASKS', {
        ...form,
        status: '0'
      })
      return add(formData, {
        onUploadProgress: (progressEvent) => {
          const { total = 0.000001, loaded = 0 } = progressEvent || {}
          commit('CHANGE_TASK', {
            ...form,
            loaded,
            total,
            status: total == loaded ? '2' : '1'
          })
        }
      })
        .then((res) => {
          commit('TOGGLE_TASK_STAUS', {
            ...form,
            ...res
          })
        })
        .catch((err) => {
          err = typeof err === 'string' ? { msg: err } : err
          commit('TOGGLE_TASK_STAUS', {
            ...form,
            ...err,
            ...{ status: '4' }
          })
        })
    }
  }
}

function findSame(task, data) {
  const { title } = task
  const unicodeId = `${title}`
  const fIndex = data.findIndex(({ title }) => {
    return unicodeId == `${title}`
  })
  return fIndex
}

export default product
