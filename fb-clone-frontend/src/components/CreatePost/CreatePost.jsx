import React, { useEffect, useState, useRef } from "react";
import { sendIcon, fileIcon } from "../../assets";
import { useDispatch } from "react-redux";
import { addPost, updatePost } from "../../features/postSlice";
import useFetch from "../../hooks/useFetch";
import Compress from "compress.js";
import { closeIcon } from "../../assets/index";
import EmojiPicker from "emoji-picker-react";
import "./createpost.css";

const initialForm = { image: null, preview: null, caption: "" };

const CreatePost = ({ post, id, close }) => {
	const [form, setForm] = useState(initialForm);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: 0, left: 0 });

	const emojiButtonRef = useRef(null);
	const emojiPickerRef = useRef(null);
	const textareaRef = useRef(null);
	const formRef = useRef(null);

	useEffect(() => {
		if (post && post._id) {
			setForm({ image: null, preview: post.image?.src, caption: post.caption });
		}
	}, [post]);

	const dispatch = useDispatch();
	const customFetch = useFetch();
	const compress = new Compress();

	const compressImage = async files => {
		const options = { size: 1, quality: 0.75, maxWidth: 1920, maxHeight: 1920, resize: true, rotate: false };
		const data = await compress.compress(files, options);
		return data;
	};

	const loadImage = async e => {
		const input = e.target;
		if (!input) return;
		var reader = new FileReader();
		reader.onload = function (e) {
			setForm(form => ({ ...form, preview: e.target.result }));
		};
		input.files[0] && reader.readAsDataURL(input.files[0]);
		const files = [...input.files];
		const data = await compressImage(files);
		const image = Compress.convertBase64ToFile(data[0]?.data, data[0]?.ext);
		setForm(form => ({ ...form, image }));
	};

	const handleEmojiClick = (emojiObject) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const newCaption =
			form.caption.slice(0, start) +
			emojiObject.emoji +
			form.caption.slice(end);

		setForm({ ...form, caption: newCaption });

		setTimeout(() => {
			textarea.setSelectionRange(start + emojiObject.emoji.length, start + emojiObject.emoji.length);
			textarea.focus();
		}, 0);
	};

	const updateEmojiPickerPosition = () => {
		if (!emojiButtonRef.current) return;

		const buttonRect = emojiButtonRef.current.getBoundingClientRect();
		const formRect = formRef.current.getBoundingClientRect();
		const pickerWidth = 350;
		const pickerHeight = 450;

		let top = buttonRect.bottom - formRect.top;
		let left = buttonRect.left - formRect.left;

		const rightEdgePosition = left + pickerWidth;
		const windowWidth = window.innerWidth;
		if (rightEdgePosition > windowWidth - 20) {
			left = left - (rightEdgePosition - windowWidth) - 20;
		}

		const bottomEdgePosition = buttonRect.bottom + pickerHeight;
		if (bottomEdgePosition > window.innerHeight - 20) {
			top = buttonRect.top - formRect.top - pickerHeight;
		}

		setEmojiPickerPosition({ top, left });
	};

	const toggleEmojiPicker = () => {
		if (!showEmojiPicker) {
			updateEmojiPickerPosition();
		}
		setShowEmojiPicker(prev => !prev);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				showEmojiPicker &&
				emojiPickerRef.current &&
				!emojiPickerRef.current.contains(event.target) &&
				emojiButtonRef.current &&
				!emojiButtonRef.current.contains(event.target)
			) {
				setShowEmojiPicker(false);
			}
		};

		const handleScroll = () => {
			if (showEmojiPicker) {
				updateEmojiPickerPosition();
			}
		};

		const handleResize = () => {
			if (showEmojiPicker) {
				updateEmojiPickerPosition();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		window.addEventListener("scroll", handleScroll);
		window.addEventListener("resize", handleResize);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
		};
	}, [showEmojiPicker]);

	const submitHandler = async e => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("image", form.image);
		formData.append("caption", form.caption.trim());
		if (post?._id) {
			dispatch(updatePost({ customFetch, id: post._id, formData }));
			close();
		} else {
			dispatch(addPost({ customFetch, formData }));
		}
		setForm(initialForm);
	};

	return (
		<article className="createpost gradient-border">
			<form onSubmit={submitHandler} ref={formRef}>
				<div className="textarea-container">
					<textarea
						ref={textareaRef}
						placeholder="What's on your mind?"
						value={form.caption}
						onChange={e => setForm({ ...form, caption: e.target.value })}
					/>
					<button
						type="button"
						className="emoji-btn"
						ref={emojiButtonRef}
						onClick={toggleEmojiPicker}
						aria-label="Choose an emoji"
					>
						😊
					</button>
				</div>

				{showEmojiPicker && (
					<div
						className="emoji-picker-container"
						ref={emojiPickerRef}
						style={{
							position: "absolute",
							top: `${emojiPickerPosition.top}px`,
							left: `${emojiPickerPosition.left}px`,
							zIndex: 1000,
						}}
					>
						<EmojiPicker onEmojiClick={handleEmojiClick} skinTonesDisabled={true} />
					</div>
				)}

				{form.preview && (
					<div className="uploaded-image">
						<img src={form.preview} alt="uploaded file" />
						<div className="close-icon" onClick={() => setForm({ ...form, image: null, preview: null })}>
							<img src={closeIcon} alt="remove" />
						</div>
					</div>
				)}
				<div className="btns">
					<label htmlFor={id || "image"} aria-label="select file">
						<div>
							<img src={fileIcon} alt="select file" />
						</div>
					</label>
					<input type="file" id={id || "image"} accept="image/png, image/jpeg" onChange={loadImage} />
					<button type="submit" aria-label="submit">
						<img src={sendIcon} alt="send" />
					</button>
				</div>
			</form>
		</article>
	);
};

export default CreatePost;
