<script setup>
	import appFireStore from "./db.js";
	import * as firebase from "firebase/database";
	import * as vue from "vue";
	import { reactive, onMounted } from "vue";
	import { getDatabase, ref, push, onValue } from "firebase/database";

	const inputUsername = vue.ref("");
	const inputMessage = vue.ref("");

	const state = reactive({
		username: "",
		messages: [],
	});

	const login = () => {
		if (!inputUsername.value || inputUsername.value !== null) {
			state.username = inputUsername.value;
			inputUsername.value = "";
		}
	};

	const logout = () => {
		state.username = "";
	};

	const sendMessage = () => {
		if (!inputMessage.value || inputMessage.value === null) {
			return;
		}

		const db = getDatabase();
		const messageRef = ref(db, "messages");

		const message = {
			username: state.username,
			content: inputMessage.value,
		};

		push(messageRef, message);
	};

	onMounted(() => {
		const db = getDatabase();
		const messageRef = ref(db, "messages");

		onValue(messageRef, (snapshot) => {
			const data = snapshot.val();
			let messages = [];

			Object.keys(data).forEach((key) => {
				messages.push({
					id: key,
					username: data[key].username,
					content: data[key].content,
				});
			});

			state.messages = messages;
		});
	});
</script>

<template>
	<div class="container">
		<section class="login-container" v-if="!state.username">
			<div class="login">
				<h1>Login to tanukiChat</h1>
				<div class="login__input-container">
					<form class="login__form" @submit.prevent="login">
						<label>username</label>
						<input
							type="text"
							placeholder="Please enter your username..."
							v-model="inputUsername"
						/>
						<button class="login__btn">Login</button>
					</form>
				</div>
			</div>
		</section>
		<div class="chat">
			<header>
				<button class="chat__logout-btn" @click="logout">Logout</button>
				<h2>Welcome, {{ state.username }}</h2>
			</header>
			<section class="chat__content">
				<div class="chat__messages">
					<div
						class="chat__message"
						v-for="message in state.messages"
						:key="message.key"
						:class="
							message.username === state.username
								? 'chat__message-user-1'
								: 'chat__message-user-2'
						"
					>
						<span class="chat__sender">{{ message.username }}</span>
						<span class="chat__text"> {{ message.content }}</span>
					</div>
				</div>
				<div class="chat__input-container">
					<form
						action=""
						class="chat__form"
						@submit.prevent="sendMessage"
					>
						<input
							type="text"
							class="chat__input"
							placeholder="Write your message..."
							v-model="inputMessage"
						/>
						<button class="chat__send-btn">Send</button>
					</form>
				</div>
			</section>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import "./assets/base.scss";
	.container {
		width: min(500px, 100%);

		color: $alt-font;

		box-shadow: 0 0 20px 2px hsl(0, 0%, 100%, 0.2);
		background-color: $color-primary;
	}

	.login-container {
		height: 100vh;
		padding: 1.5rem;
		display: grid;
		place-items: center;

		.login {
			width: 100%;
			padding: 8rem 2rem;

			border-radius: 24px;
			background-color: $alt-bg;

			h1 {
				@include h1;
				margin-bottom: 3rem;
			}

			.login__form {
				display: grid;

				label {
					font-size: 1.6rem;
					font-weight: 300;
					text-transform: capitalize;
					color: $color-primary;
				}

				input {
					@include input;
					border-radius: 12px;
					box-shadow: inset 0 0 5px hsl(0, 0%, 100%, 0.1);

					&::placeholder {
						opacity: 0.5;
					}

					&:focus {
						outline: 1px solid $color-secondary;
					}
				}

				.login__btn {
					padding: 0.6rem;
					margin-top: 1.2rem;
					border: none;
					border-radius: 12px;
					background-color: $color-primary;
					font-family: $base-font-family;
					font-size: 1.8rem;
					font-weight: 600;
					text-transform: capitalize;
					color: $base-font;
					cursor: pointer;
					box-shadow: 0 0 5px hsl(0, 0%, 100%, 0.2);

					&:hover {
						filter: brightness(1.1);
					}
					&:active {
						transform: scale(0.99);
					}
					&:focus {
						outline: 1px solid $color-secondary;
					}
				}
			}
		}
	}

	.chat {
		height: 100vh;
		display: flex;
		flex-direction: column;
		// justify-content: space-between;

		header {
			padding: 2rem;

			.chat__logout-btn {
				display: block;
				border: none;
				background: none;

				margin: 2rem 2rem 2rem auto;
				font-size: 1.6rem;
				color: $base-font;
				opacity: 0.7;

				cursor: pointer;

				&:hover {
					opacity: 1;
				}

				&:focus {
					outline: 1px solid $color-secondary;
				}
			}

			h2 {
				font-size: 3rem;
				font-weight: 400;
				color: $base-font;
			}
		}

		.chat__content {
			flex: 1;
			display: grid;
			grid-template-rows: 1fr min-content;

			box-shadow: 0 0 15px 2px hsl(0, 0%, 0%, 0.4);
			border-radius: 20px 20px 0 0;
			background-color: $base-bg;

			.chat__messages {
				padding: 2rem;
				.chat__message {
					@include chatMessage;

					.chat__text {
						font-size: 1.8rem;
						font-weight: 300;
						color: $base-font-lighter;
					}

					.chat__sender {
						color: $base-font;
					}
				}
				.chat__message-user-1 {
					background-color: $color-primary;
					color: $base-font-lighter;
				}
				.chat__message-user-2 {
					background-color: $color-secondary;
					color: $base-font-lighter;
					margin-left: auto;
				}
			}

			.chat__input-container {
				background-color: $alt-bg;
				padding: 3rem;
				position: relative;

				&::before {
					content: "";
					display: block;
					position: absolute;
					width: 100%;
					height: 1px;
					top: 0;
					left: 0;
					z-index: 1;

					box-shadow: 0 -6px 7.5px hsl(0, 0%, 100%, 0.5);
				}

				.chat__form {
					display: flex;
					border-radius: 12px;
					overflow: hidden;

					.chat__input {
						@include input;
						width: 100%;

						&::placeholder {
							opacity: 0.5;
						}

						&:focus {
							outline: 2px solid $color-secondary;
						}
					}

					.chat__send-btn {
						border: 0;
						padding-inline: 1rem;
						background-color: $color-primary;
						cursor: pointer;
						color: $base-font;
						opacity: 0.7;

						&:hover {
							opacity: 1;
						}

						&:active {
							filter: brightness(1.1);
						}

						&:focus {
							outline: 2px solid $color-secondary;
						}
					}
				}
			}
		}
	}
</style>
