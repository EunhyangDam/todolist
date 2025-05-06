Vue.createApp({
  data() {
    return {
      state: {
        isModalOn: false,
        isEdit: false,
        id: "",
        newTask: "",
        newExpire: "",
        taskList: [],
        totalLength: 0,
        viewLength: 6,
        pages: 0,
        listStart: 0,
        listEnd: 0,
      },
    };
  },
  created() {
    if (JSON.parse(localStorage.getItem("taskList")) !== "") {
      this.state.taskList = JSON.parse(localStorage.getItem("taskList"));
    }
    this.state.totalLength = this.state.taskList.length;
    this.state.pages = Math.ceil(
      this.state.totalLength / this.state.viewLength
    );
    this.state.listStart = this.state.listStart * this.state.viewLength;
    this.state.listEnd = this.state.listStart + this.state.viewLength;
  },
  beforeUpdate() {},
  updated() {
    this.state.totalLength = this.state.taskList.length;
    this.state.pages = Math.ceil(
      this.state.totalLength / this.state.viewLength
    );
  },
  methods: {
    updateFn() {
      this.state.taskList.map((el) =>
        el.id === this.state.id
          ? ((el.task = this.state.newTask),
            (el.expire = new Date(this.state.newExpire)
              .toUTCString()
              .slice(0, -7)))
          : el
      );
      this.state.editState = false;
      this.$refs.refNewTask.focus();
      this.state.newExpire = "";
      this.state.newTask = "";
      this.state.id = "";
      localStorage.setItem("taskList", JSON.stringify(this.state.taskList));
    },
    keyUpTaskSubmit(e) {
      if (this.state.newTask.trim() === "" && this.state.newExpire !== "") {
        this.$refs.inputTask.focus();
        return;
      }
      if (this.state.newTask.trim() !== "" && this.state.newExpire === "") {
        this.$refs.inputExpire.focus();
        return;
      }
      if (this.state.newTask.trim() === "" && this.state.newExpire === "") {
        alert("add your task!");
        return;
      } else if (new Date(this.state.newExpire) < new Date()) {
        alert("select a future!");
        return;
      }
      if (this.state.isEdit === true) {
        this.updateFn();
      }
      this.state.taskList = [
        {
          id: this.state.taskList.length + 1,
          task: this.state.newTask,
          expire: new Date(this.state.newExpire).toUTCString().slice(0, -7),
          done: false,
        },
        ...this.state.taskList,
      ];
      localStorage.setItem("taskList", JSON.stringify(this.state.taskList));
      return;
    },
    clickDelete(id) {
      if (this.state.isEdit === false) {
        this.state.taskList = this.state.taskList.filter((el) => {
          el.id !== id;
        });
      } else {
        this.state.newExpire = "";
        this.state.newTask = "";
        this.state.isEdit = false;
      }
      localStorage.setItem("taskList", JSON.stringify(this.state.taskList));
    },
    clickChk(e) {
      this.state.taskList.map((el) => {
        if (e.target.checked) {
          el.done === true;
        } else {
          el.done === false;
        }
        localStorage.setItem("taskList", JSON.stringify(this.state.taskList));
      });
    },
    clickEdit(el) {
      if (this.state.isEdit === false) {
        this.state.isEdit = true;
        let today = new Date();
        today.setHours(today.getHours() + 9);
        this.state.newExpire = today.toISOString().slice(0, -8);
        this.state.newTask = el.task;
        this.state.id = el.id;
        this.state.taskList.map((el2) =>
          el2.id == el.id ? (el2.isedit = true) : el2
        );
      }
      localStorage.setItem("taskList", JSON.stringify(this.state.taskList));
    },
    clickPageTransition(n) {
      this.state.listStart = n - 1;
      this.state.listStart = this.state.listStart * this.state.viewLength;
      this.state.listEnd = this.state.listStart + this.state.viewLength;
    },
  },
}).mount("#root");
