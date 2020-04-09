import React, {Component, Fragment} from 'react';

import Form from '../components/form';
import Notes from '../components/notes';

import {NoteData} from 'types';

interface ListPageProps {
    notes: NoteData[];
}

interface ListPageState {
    notes: NoteData[];
    loading: boolean;
}

export default class IndexPage extends Component<ListPageProps, ListPageState> {
    state: ListPageState = {
        loading: true,
        notes: []
    };

    componentDidMount() {
        // После того как страница будет отрисована, делаем запрос за всеми доступными заметками
        this.fetchNotes();
    }

    fetchNotes = () => {
        fetch('/api/notes')
            .then(response => response.json())
            .then(notes => this.setState({loading: false, notes}));
    }

    handleSubmit = (note: NoteData) => {
        fetch('/api/notes', {
            body: JSON.stringify(note),
            headers: {'Content-Type': 'application/json'},
            method: 'POST'
        })
            // После того как заметка будет сохранена, делаем запрос за всеми доступными заметками,
            // чтобы получить обновленные данные
            .then(this.fetchNotes);
    }

    render() {
        const {notes, loading} = this.state;

        // Если данные еще не получены, сообщаем об этом пользователю
        if (loading) {
            return <p>Loading...</p>;
        }

        // Если список заметок пуст, сообщаем об этом пользователю
        if (!notes.length) {
            return <p>Notes not found!</p>;
        }

        return (
            <Fragment>
                <Notes notes={notes}/>
                <Form onSumbit={this.handleSubmit}/>
            </Fragment>
        );
    }
}
