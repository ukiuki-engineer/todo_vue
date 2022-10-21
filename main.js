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
// Vue.component('vue-markdown', VueMarkdown);
Vue.use(VueMarkdown);
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
    editting_time_id: null,
    selectedTasks: [],
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
    // タスク追加
    addTask: function() {
      this.tasks.push({
        // id: taskStorage.uid++,
        id: this.tasks.length + 1,
        name: this.submittedTask,
        status_id: 0,
        comment: null,
        time: null,
        isCheck: false,
      })
      this.submittedTask = null;
    },
    // すべてのタスクを選択する
    checkAll: function() {
      var flag = true;
      this.tasks.forEach(task => {
        flag = flag && task.isCheck;
      })
      if(flag == true){
        this.tasks.forEach(task => {
          task.isCheck = false;
        })
      } else {
        this.tasks.forEach(task => {
          task.isCheck = true;
        })
      }
    },
    // タスク削除
    deleteTask: function() {
      const message = 'checkされているタスクを全て削除しても良いですか？'
      if (confirm(message)) {
        this.tasks = this.tasks.filter(task => task.isCheck == null || task.isCheck == false)
        // ローカルストレージを保存
        taskStorage.save(this.tasks);
        // fetchして更新
        this.tasks = taskStorage.fetch()
        // FIXME:備考にmarkdownが書いてあると、一度再読み込みしないと反映されない
        window.location.reload();
      }
    },
    // Enterキー押下時の処理
    onKeydownEnter: function(keyCode, target) {
      if (keyCode !== 13) return;
      if (target == 'name') {
        this.editting_task_id = null;
      } else {
        this.editting_comment_id = null;
      }
    },
    // 行ドラッグ時の挙動
    dragTask: function(event, dragIndex) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('drag-index', dragIndex);
    },
    // 行ドロップ時の挙動
    dropTask: function(event, dropIndex) {
      const dragIndex = event.dataTransfer.getData('drag-index')
      const deleteTask = this.tasks.splice(dragIndex, 1);
      this.tasks.splice(dropIndex, 0, deleteTask[0])
      // ローカルストレージを保存
      taskStorage.save(this.tasks);
      // fetchして更新
      this.tasks = taskStorage.fetch();
      // FIXME:備考にmarkdownが書いてあると、一度再読み込みしないと反映されない
      window.location.reload();
    },
    // 時刻編集をオン
    endTime: function(id) {
      this.editting_time_id = id;
    },
  }
});
