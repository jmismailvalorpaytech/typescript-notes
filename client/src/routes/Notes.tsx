import { useEffect } from 'react';
import { Card, Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom'

// Types
import { AppDispatch, RootState } from '../store'

type Props = {}

export default function Notes({ }: Props) {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const notes: any = useSelector<RootState>(store => store.notes.notes);

    // Get Initial Notes Data
    useEffect(() => {
        dispatch({
            type: 'FETCH_ALL_USER_NOTES'
        });
    }, []);


    const handleRedirect = (id: number): void => {
        navigate(`/${id}`)
    }
    const editRedirect = (id: number): void => {
        navigate(`/edit/${id}`)
    }

    const redirectCreate = (): void => {
        navigate(`/create`)
    }

    return (
        <Container className='my-4'>
            {/* <h2 className="text-primary">All </h2> */}
            <Button onClick={redirectCreate}> Add </Button>
            {notes?.map((note: any, index: number) => (
                <Card key={index} className='my-1'>
                    <Card.Body  onClick={() => handleRedirect(note.id)} style={{ cursor: 'pointer' }}>
                        <Card.Title>{note.title}</Card.Title>
                        <p>{note.body.substr(0, 100)}{note.body.length > 100 ? "..." : ""}</p>
                    </Card.Body>
                    <Card.Footer>
                        <Button onClick={() => editRedirect(note.id)}> Edit </Button>
                    </Card.Footer>
                </Card>
            ))}
        </Container>
    )
}