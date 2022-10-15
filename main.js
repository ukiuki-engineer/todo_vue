new Vue({
  el: '#app',
  data: {
    tasks: [],
    submittedTask: null,
    statuses: [
      {id: 0, name: '未着手'},
      {id: 1, name: '着手'},
      {id: 2, name: '作業中'},
      {id: 3, name: '保留'},
      {id: 4, name: '完了'},
    ],
  },
  computed: {
    statusText: function() {
      return function(id) {
        return this.statuses.find(object => object.id == id).name;
      };
    },
  },
  methods: {
    // タスクを追加
    addTask: function() {
      this.tasks.push({
        // id: todoStorage.uid++,
        id: this.tasks.length,
        name: this.submittedTask,
        status_id: 0,
      })
      this.submittedTask = null;
    },
  }
});