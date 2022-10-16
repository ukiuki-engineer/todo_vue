// ライブラリのインポート
Vue.component('v-select', VueSelect.VueSelect);
// Vueインスタンス
new Vue({
  el: '#app',
  data: {
    test: true,
    tasks: [],
    submittedTask: null,
    statuses: [
      {id: 0, name: '未着手'},
      {id: 1, name: '着手'},
      {id: 2, name: '作業中'},
      {id: 3, name: '保留'},
      {id: 4, name: '完了'},
    ],
    subtasks: [
      {id: 0, name: 'サブタスク1', status_id: 0},
      {id: 1, name: 'サブタスク2', status_id: 0},
      {id: 2, name: 'サブタスク3', status_id: 0},
    ],
    editting_task_id: null,
    editting_comment_id: null,
  },
  computed: {
    hasSubTasks: function() {
      return function(id) {
        return id == 0 ? true : false;
      }
    },
    isEditTask: function() {
      return function(id) {
        return this.editting_task_id ? id == this.editting_task_id : false;
      }
    },
    isEditComment: function() {
      return function(id) {
        return this.editting_comment_id ? id == this.editting_comment_id : false;
      }
    },
  },
  methods: {
    // タスクの追加
    addTask: function() {
      this.tasks.push({
        // id: todoStorage.uid++,
        id: this.tasks.length + 1,
        name: this.submittedTask,
        status_id: 0,
        comment: null,
      })
      this.submittedTask = null;
    },
  }
});
