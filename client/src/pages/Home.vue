<template>
  <div class="home">
    <h1>Home Page</h1>
    <section v-if="!join">
      <form @submit.prevent="joinRoom" action="">
        <input
          type="text"
          name=""
          id=""
          placeholder="Enter your name"
          v-model="userName"
        />
        <button>Join Chat</button>
      </form>
    </section>
    <section class="room" v-if="join">
      <div class="users">
        <h3>Users</h3>
        <ul>
          <li v-for="user in users" :key="user.id">
            <span>{{ user.name }}</span>
          </li>
        </ul>
      </div>
      <div class="chat">
        <h3>chat</h3>
        <div class="messages">
          <ul>
            <li v-for="message in messages" :key="message.time">
              <div>
                <span>{{ message.userName }}</span>
              </div>
              <div>
                <span>{{ new Date(message.time).toLocaleString() }}</span>
              </div>
              <div>
                <span>{{ message.content }}</span>
              </div>
              <br />
            </li>
          </ul>
        </div>
        <div class="input">
          <form @submit.prevent="sendMessage" action="">
            <input type="text" name="" id="" v-model="message" />
            <button>send</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: "Home",
  components: {},
  sockets: {
    connect: function() {
      console.log("socket to notification channel connected");
    },
    disconnect: function() {
      this.$socket.emit("disconnect");
    },
  },

  data() {
    return {
      join: false,
      userName: "",
      users: [],
      message: "",
      messages: [],
    };
  },
  methods: {
    joinRoom() {
      if (this.userName) {
        this.join = true;
        this.$socket.emit("join room", this.userName);
      }
    },
    sendMessage() {
      this.$socket.emit("message", this.message);
    },
  },
  mounted() {
    this.sockets.subscribe("users", (users) => {
      console.log(users);
      this.users = users;
    });

    this.sockets.subscribe("message", (message) => {
      console.log(message);
      this.messages.push({
        userName: message.userName,
        content: message.content,
        time: message.time,
      });
    });
  },
  beforeUnmount() {
    this.$socket.emit("disconnect");
  },
};
</script>
<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
ul {
  list-style: none;
}
.room {
  display: flex;
}
.users {
}
.input {
}
.chat {
}
</style>
