import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { Container, Button, Divider } from 'semantic-ui-react';


export default function DraftEditor(props) {
    const [editorState, setEditorState] = useState(
        props.body && props.body.length > 0 ?
            convertFromRaw(props.body)
            :
            EditorState.createEmpty()
    );
    const [savedRawState, setSavedRawState] = useState(JSON.stringify(convertToRaw(editorState.getCurrentContent())))

    const saved = savedRawState === JSON.stringify(convertToRaw(editorState.getCurrentContent()))

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState)
            // this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    // const rawDraftContentState = JSON.stringify(convertToRaw(editorState.getCurrentContent()))

    console.log(savedRawState)
    return (
        <Container text>
            <Button onClick={() => setSavedRawState(JSON.stringify(convertToRaw(editorState.getCurrentContent())))} content="see state" />
            <Divider />
            <Editor
                editorState={editorState}
                onChange={setEditorState}
                handleKeyCommand={(c, es) => handleKeyCommand(c, es)}
            />
        </Container>
    );
}

