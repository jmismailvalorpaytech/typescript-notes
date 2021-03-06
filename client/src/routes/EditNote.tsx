import React, { useState, useCallback, useEffect } from 'react';
import { Alert, Button, Container, Form } from "react-bootstrap";
import rehypeSanitize from "rehype-sanitize";
import MdEditor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'

// Types
import { AppDispatch, RootState } from '../store';

// Components
import Layout from "../includes/Layout"

// UI
import 'react-markdown-editor-lite/lib/index.css';

type Props = {}


type Value = {
    text: string,
    html?: string
}

const EditNote = (props: Props) => {

    const [value, setValue] = useState<Value | undefined>();
    const [preview, setPreview] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('');

    const [error, setError] = useState<string>('')
    const params = useParams();

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleChange = useCallback((value: any | undefined): any => {
        setValue(value)
    }, [value]);


    const handleTitleChange = useCallback((e: any): void => {
        setTitle(e.target.value)
    }, [title]);


    const changeError = (value: string): void => {
        setError(value)
    };

    // Params
    const noteId = params.noteId;

    // Get Initial Notes Data
    useEffect(() => {
        dispatch({
            type: 'FETCH_SINGLE_USER_NOTE',
            payload: noteId
        });
    }, [noteId]);

    const data: any = useSelector<RootState>(store => store.notes.note);

    // Get Initial Notes Data
    useEffect(() => {
        if (data) {
            setTitle(data.title);
            setValue({ text: data.body })
        }
    }, [data]);


    const getValue: any = value;

    const successClbk = () => {
        navigate('/')
    }

    const handleSubmit = (): void => {
        if (getValue.text && getValue.text.trim() !== '' && title.trim() !== '') {
            dispatch({
                type: 'UPDATE_NOTE_INIT',
                payload: {
                    title,
                    body: getValue.text,
                    id: noteId
                },
                success: successClbk
            })
            changeError('')
        }

        else if (title.length > 40) {
            changeError('Title should be less than 40 characters');
        }
        else {
            changeError('Title and Content required')
        }
    }


    const togglePreview = (): void => {
        setPreview(!preview)
    }


    return (
        <Layout>

            {error && (
                <Alert variant='danger'>
                    {error}
                </Alert>
            )}

            {!preview ? (
                <div>
                    <Form.Group>

                        <Form.Control
                            type='text'
                            placeholder='Enter Title'
                            onChange={handleTitleChange}
                            value={title}
                        />
                    </Form.Group>

                    <div className="my-1">
                        <MdEditor style={{ height: '500px' }}
                            allowPasteImage
                            value={getValue && getValue.text}
                            view={{ menu: true, md: true, html: false }}
                            renderHTML={text => (
                                <ReactMarkdown
                                    children={text}
                                    rehypePlugins={[
                                        rehypeSanitize
                                    ]}
                                />
                            )}
                            onChange={handleChange} />
                    </div>
                </div>
            ) : (
                <div>
                    <h2>{title}</h2>
                    <ReactMarkdown
                        children={getValue.text}
                        rehypePlugins={[
                            rehypeSanitize
                        ]}
                    />
                </div>
            )}

            <Button onClick={() => togglePreview()} className='my-4 mx-2' variant='light'> {preview ? 'Editor' : 'Preview'}  </Button>
            <Button onClick={() => handleSubmit()} className='my-4'> Update </Button>
        </Layout>
    )
}

export default EditNote;