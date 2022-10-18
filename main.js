/*
 * ローカルストレージへの保存
 */
var STORAGE_KEY = 'todo_vue'
var taskStorage = {
  fetch: function () {
    var tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    tasks.forEach(function (task, index) {
      task.id = index + 1;
    })
    taskStorage.uid = tasks.length + 1;
    return tasks;
  },
  save: function (tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}
/*
 * ライブラリのインポート
 */
Vue.component('v-select', VueSelect.VueSelect);
/*
 * Vueインスタンス
 */
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
  watch: {
    // オプションを使う場合はオブジェクト形式にする
    tasks: {
      // 引数はウォッチしているプロパティの変更後の値
      handler: function (tasks) {
        taskStorage.save(tasks)
      },
      // deep オプションでネストしているデータも監視できる
      deep: true
    }
  },
  created() {
    // インスタンス作成時に自動的にfetch()する
    this.tasks = taskStorage.fetch()
  },
  methods: {
    // タスクの追加
    addTask: function() {
      this.tasks.push({
        // FIXME: 更新すると何故かid=0からリナンバーされる
        // id: taskStorage.uid++,
        id: this.tasks.length + 1,
        name: this.submittedTask,
        status_id: 0,
        comment: null,
      })
      this.submittedTask = null;
    },
    deleteAll: function () {
      if (confirm("全てのタスクを削除しても良いですか？")) {
        this.tasks = [];
        taskStorage.uid = 1;
      }
    },
    deleteTask: function(id) {
      if (confirm("id=" + id + "のタスクを削除しても良いですか？")) {
        this.tasks.splice(--id, 1);
        taskStorage.save(this.tasks);
        this.tasks = taskStorage.fetch()
      }
    }
  }
});
