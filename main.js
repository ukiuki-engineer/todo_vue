/*
 * ローカルストレージへの保存
 */
var STORAGE_KEY = 'todo_vue'
var taskStorage = {
  fetch: function () {
    var tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
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
// NOTE: VueMarkdownの場合はVue.component()ではなくVue.use()で読み込む(?)
// Vue.component('vue-markdown', VueMarkdown);
Vue.use(VueMarkdown);
/*
 * Vueインスタンス
 */
new Vue({
  el: '#app',
  data: {
    tasks: [],
    submittedTask: null,
    statuses: [
      {id: 0, name: '0:未着手'},
      {id: 1, name: '1:着手'},
      {id: 2, name: '2:作業中'},
      {id: 3, name: '3:保留'},
      {id: 4, name: '4:完了'},
    ],
    editting_task_id: null,
    editting_comment_task_id: null,
    editting_time_task_id: null,
    editting_date_task_id: null,
    selectedTasks: [],
    sortSettings: {
      key: null,
      order: null,
    },
    dragoverIndex: null,
  },
  computed: {
    isEditTask: function() {
      return function(task_id) {
        return this.editting_task_id ? task_id == this.editting_task_id : false;
      }
    },
    isEditComment: function() {
      return function(task_id) {
        return this.editting_comment_task_id ? task_id == this.editting_comment_task_id : false;
      }
    },
  },
  watch: {
    // tasksが変更されると自動的にsaveする
    tasks: {
      // handlerはdeepやimmediateなどのオプションを使用する時になるオブジェクト
      // 引数はウォッチしているプロパティの変更後の値
      handler: function (tasks) {
        taskStorage.save(tasks)
      },
      // 指定したプロパティの中にある、プロパティの値も監視する（入れ子・ネストしたプロパティ）
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
      // タスクidの配列
      let taskIds = this.tasks.map(task => task["id"]);
      // タスク追加
      this.tasks.push({
        id: this.tasks.length == 0 ? 1 : Math.max(...taskIds) + 1, // 既存idの最大値+1を新idに
        name: this.submittedTask,
        status_id: 0,
        comment: null,
        time: null,
        date: null,
        isCheck: false,
      });
      this.submittedTask = null;
      if (this.sortSettings.key == 'id' && this.sortSettings.order == -1) {
        this.tasks.sort((a, b) => {
          return (b.id - a.id);
        });
      }
    },
    // すべてのタスクを選択する
    checkAll: function() {
      // 一つでもcheckが入っているのかいないのか
      let flag = true;
      this.tasks.forEach(task => {
        task.isCheck == undefined ? flag = flag && false : flag = flag && task.isCheck;
      });
      // 一つでもcheckが入っていなければ全てにcheckを入れる
      // 全てにcheckが入っていなかったら全てのcheckを外す
      this.tasks.forEach(task => {
        flag ? task.isCheck = false : task.isCheck = true;
      });
    },
    // タスク削除
    deleteTask: function() {
      const message = 'checkされているタスクを全て削除しても良いですか？'
      if (confirm(message)) {
        this.tasks = this.tasks.filter(task => task.isCheck == null || task.isCheck == false)
      }
    },
    // 現在の並びでタスクをrenumberする
    // FIXME: 日付や時刻が全部nullの時もソートされてしまう
    renumber: function() {
      this.tasks.forEach((task, index) => {
        task.id = index + 1;
      })
    },
    // タスク編集フォームでのEnterキー押下時の処理
    onKeydownEnter: function(keyCode, target) {
      if (keyCode !== 13) return;
      if (target == 'name') {
        this.editting_task_id = null;
      } else {
        this.editting_comment_task_id = null;
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
      this.dragoverIndex = null;
      const dragIndex = event.dataTransfer.getData('drag-index')
      const deleteTask = this.tasks.splice(dragIndex, 1);
      this.tasks.splice(dropIndex, 0, deleteTask[0])
    },
    // 時刻編集をオン
    editTime: function(task_id) {
      this.editting_time_task_id = task_id;
    },
    editDate: function(task_id) {
      this.editting_date_task_id = task_id;
    },
    // 指定されたキーでソート
    sortBy: function(key) {
      // ソートキーの設定
      if (key == this.sortSettings.key) {
        this.sortSettings.order = -1 * this.sortSettings.order;
      } else if (this.sortSettings.key = null || key != this.sortSettings.key) {
        this.sortSettings.order = 1;
      }
      this.sortSettings.key = key;
      // FIXME: markdownの影響なのか、commentは上手くソートできない
      // FIXME: 時刻をソートできるようにする
      // ソート
      if (key == 'name' || key == 'time' || key == 'date') {
        this.tasks.sort((a, b) => {
          return a[key] > b[key] ? this.sortSettings.order * 1 : this.sortSettings.order * -1;
        });
      } else {
        this.tasks.sort((a, b) => {
          return this.sortSettings.order * (a[key] - b[key]);
        });
      }
    },
    // ドラッグオーバーした行を記録
    dragover: function(index) {
      this.dragoverIndex = index;
    }
  }
});
