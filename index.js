import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class SearchField extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
  }

  handleSearchTextChange(e) {
    this.props.onSearchTextChange(e.target.value);
  }

  render() {
    return (
      <input type="text" className="search-field" value={this.props.searchText} onChange={this.handleSearchTextChange} placeholder="Search notes..." />
    );
  }
}

class SelectButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelectClick = this.handleSelectClick.bind(this);
  }

  handleSelectClick(e) {
    this.props.onSelectClick();
  }

  render() {
    if(this.props.shown) {
      return <button className="select-button" onClick={this.handleSelectClick}>Select Notes for Deletion</button>;
    } else {
      return null;
    }
  }
}

class CancelButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  handleCancelClick(e) {
    this.props.onCancelClick();
  }

  render() {
    if(this.props.shown) {
      return <button className="cancel-selection-button" onClick={this.handleCancelClick}>Cancel Selection</button>;
    } else {
      return null;
    }
  }
}

class DeleteButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick(e) {
    this.props.onDeleteClick();
  }

  render() {
    if(this.props.shown) {
      return <button className="delete-selected-button" onClick={this.handleDeleteClick}>Delete Selected</button>;
    } else {
      return null;
    }
  }
}

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.handleNoteClick = this.handleNoteClick.bind(this);
  }

  handleNoteClick(e) {
    this.props.onNoteClick(this.props.id, this.props.title, this.props.content);
  }

  render() {
    return (
      <div className={"note" + ((this.props.selected)? ' selected' : '')} onClick={this.handleNoteClick}>
        <h2 className="noteTitle">{this.props.title}</h2>
        <p className="noteContent">{this.props.content}</p>
      </div>
    );
  }
}

class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.handleNoteClick = this.handleNoteClick.bind(this);
  }

  handleNoteClick(clickedNoteId, clickedNoteTitle, clickedNoteContent) {
    this.props.onNoteClick(clickedNoteId, clickedNoteTitle, clickedNoteContent);
  }

  render() {
    let filteredNotes = [];
    this.props.savedNotes.forEach(savedNote => {
      let noteTitleLower = savedNote.title.toLowerCase();
      let noteContentLower = savedNote.content.toLowerCase();
      let searchTextLower = this.props.searchText.toLowerCase();
      if(noteTitleLower.includes(searchTextLower) || noteContentLower.includes(searchTextLower)) {
        filteredNotes.push(savedNote);
      } else {
        return;
      }
    });

    let filteredNotesElements = filteredNotes.map(filteredNote => {
      return (
        <Note
          key={filteredNote.id}
          id={filteredNote.id}
          title={filteredNote.title}
          content={filteredNote.content}
          selected={this.props.selectedNoteIds.includes(filteredNote.id)}
          onNoteClick={this.handleNoteClick}
        />
      );
    });
    return (
      <div className="notes">
        {filteredNotesElements}
      </div>
    );
  }
}

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
  }

  handleBackdropClick(e) {
    if(e.target === document.getElementById(this.props.modalId)) {
      this.props.onCloseClick();
    }
  }

  handleCloseClick(e) {
    this.props.onCloseClick();
  }

  render() {
    return (
      <div className="modal-backdrop" id={this.props.modalId} onClick={this.handleBackdropClick}>
        <div className="modal-box">
          <button className="modal-close-button modal-button" onClick={this.handleCloseClick}>&times;</button>
          {this.props.children}
        </div>
      </div>
    );
  }
}

class CreateNoteModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleDiscardClick = this.handleDiscardClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  handleCloseClick(e) {
    this.props.onCloseClick();
  }

  handleTitleChange(e) {
    this.props.onTitleChange(e.target.value);
  }

  handleContentChange(e) {
    this.props.onContentChange(e.target.value);
  }

  handleDiscardClick(e) {
    this.props.onDiscardClick();
  }

  handleSaveClick(e) {
    this.props.onSaveClick();
  }

  render() {
    if(this.props.shown) {
      return (
        <Modal modalId="create-note-modal" onCloseClick={this.handleCloseClick}>
          <input type="text" value={this.props.title} onChange={this.handleTitleChange} placeholder="Title..." />
          <textarea value={this.props.content} onChange={this.handleContentChange} placeholder="Note..." rows="15" />
          <div className="note-buttons">
            <button className="note-discard-button modal-button" onClick={this.handleDiscardClick}>Discard</button>
            <button className="note-save-button modal-button" onClick={this.handleSaveClick}>Save</button>
          </div>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

class ViewNoteModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleCloseClick(e) {
    this.props.onCloseClick();
  }

  handleDeleteClick(e) {
    this.props.onDeleteClick();
  }

  handleEditClick(e) {
    this.props.onEditClick();
  }

  render() {
    if(this.props.shown) {
      return (
        <Modal modalId="view-note-modal" onCloseClick={this.handleCloseClick}>
          <h2 className="noteTitle">{this.props.title}</h2>
          <p className="noteContent">{this.props.content}</p>
          <div className="note-buttons">
            <button className="note-delete-button modal-button" onClick={this.handleDeleteClick}>Delete</button>
            <button className="note-edit-button modal-button" onClick={this.handleEditClick}>Edit</button>
          </div>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

class EditNoteModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleDiscardClick = this.handleDiscardClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  handleCloseClick(e) {
    this.props.onCloseClick();
  }

  handleTitleChange(e) {
    this.props.onTitleChange(e.target.value);
  }

  handleContentChange(e) {
    this.props.onContentChange(e.target.value);
  }

  handleDiscardClick(e) {
    this.props.onDiscardClick();
  }

  handleSaveClick(e) {
    this.props.onSaveClick();
  }

  render() {
    if(this.props.shown) {
      return (
        <Modal modalId="edit-note-modal" onCloseClick={this.handleCloseClick}>
          <input type="text" value={this.props.title} onChange={this.handleTitleChange} placeholder="Title..." />
          <textarea value={this.props.content} onChange={this.handleContentChange} placeholder="Note..." rows="15" />
          <div className="note-buttons">
            <button className="note-discard-button modal-button" onClick={this.handleDiscardClick}>Discard</button>
            <button className="note-save-button modal-button" onClick={this.handleSaveClick}>Save</button>
          </div>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

class NotesApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      savedNotes: [],
      currentNote: {
        id: undefined,
        title: '',
        content: ''
      },
      unsavedNote: {
        title: '',
        content: ''
      },
      selectionMode: false,
      selectedNoteIds: [],
      createModalShown: false,
      viewModalShown: false,
      editModalShown: false
    };
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleSelectClick = this.handleSelectClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleCreateClick = this.handleCreateClick.bind(this);
    this.handleNoteClick = this.handleNoteClick.bind(this);
    this.handleCreateCloseClick = this.handleCreateCloseClick.bind(this);
    this.handleCreateTitleChange = this.handleCreateTitleChange.bind(this);
    this.handleCreateContentChange = this.handleCreateContentChange.bind(this);
    this.handleCreateDiscardClick = this.handleCreateDiscardClick.bind(this);
    this.handleCreateSaveClick = this.handleCreateSaveClick.bind(this);
    this.handleViewCloseClick = this.handleViewCloseClick.bind(this);
    this.handleEditCloseClick = this.handleEditCloseClick.bind(this);
    this.handleViewDeleteClick = this.handleViewDeleteClick.bind(this);
    this.handleViewEditClick = this.handleViewEditClick.bind(this);
    this.handleEditTitleChange = this.handleEditTitleChange.bind(this);
    this.handleEditContentChange = this.handleEditContentChange.bind(this);
    this.handleEditDiscardClick = this.handleEditDiscardClick.bind(this);
    this.handleEditSaveClick = this.handleEditSaveClick.bind(this);
  }

  componentDidMount() {
    if(!localStorage.length) {
      this.setState({savedNotes: this.props.predefinedNotes});
    } else {
      this.setState({savedNotes: JSON.parse(localStorage.getItem('savedNotes'))});
    }
  }

  handleSearchTextChange(changedSearchText) {
    this.setState({
      searchText: changedSearchText
    });
  }

  handleSelectClick() {
    this.setState({
      selectionMode: true
    });
  }

  handleCancelClick() {
    this.setState({
      selectedNoteIds: [],
      selectionMode: false
    });
  }

  handleDeleteClick() {
    this.setState({
      savedNotes: this.state.savedNotes.filter(savedNote => !this.state.selectedNoteIds.includes(savedNote.id)),
      selectedNoteIds: [],
      selectionMode: false
    }, () => {
      localStorage.setItem('savedNotes', JSON.stringify(this.state.savedNotes));
    });
  }

  handleCreateClick() {
    this.setState({
      createModalShown: true
    });
  }

  handleCreateTitleChange(unsavedTitle) {
    this.setState({
      unsavedNote: {
        title: unsavedTitle,
        content: this.state.unsavedNote.content
      }
    });
  }

  handleCreateContentChange(unsavedContent) {
    this.setState({
      unsavedNote: {
        title: this.state.unsavedNote.title,
        content: unsavedContent
      }
    });
  }

  handleCreateDiscardClick() {
    this.setState({
      unsavedNote: {
        title: '',
        content: ''
      },
      createModalShown: false
    });
  }

  handleCreateSaveClick() {
    let lastSavedNote = this.state.savedNotes[this.state.savedNotes.length - 1];
    this.setState({
      savedNotes: this.state.savedNotes.concat([{
        id: lastSavedNote.id + 1,
        title: this.state.unsavedNote.title,
        content: this.state.unsavedNote.content
      }]),
      unsavedNote: {
        title: '',
        content: ''
      },
      createModalShown: false
    }, () => {
      localStorage.setItem('savedNotes', JSON.stringify(this.state.savedNotes));
    });
  }

  handleCreateCloseClick() {
    this.setState({createModalShown: false});
  }

  handleNoteClick(clickedNoteId, clickedNoteTitle, clickedNoteContent) {
    if(!this.state.selectionMode) {
      this.setState({
        currentNote: {
          id: clickedNoteId,
          title: clickedNoteTitle,
          content: clickedNoteContent
        },
        viewModalShown: true
      });
    } else {
      if(!this.state.selectedNoteIds.includes(clickedNoteId)) {
        this.setState({selectedNoteIds: this.state.selectedNoteIds.concat([clickedNoteId])});
      } else {
        this.setState({selectedNoteIds: this.state.selectedNoteIds.filter(selectedNoteId => selectedNoteId !== clickedNoteId)});
      }
    }
  }

  handleViewDeleteClick() {
    this.setState({
      savedNotes: this.state.savedNotes.filter(savedNote => savedNote.id !== this.state.currentNote.id),
      viewModalShown: false
    }, () => {
      localStorage.setItem('savedNotes', JSON.stringify(this.state.savedNotes));
    });
  }

  handleViewEditClick() {
    this.setState({
      unsavedNote: this.state.currentNote,
      viewModalShown: false,
      editModalShown: true
    })
  }

  handleViewCloseClick() {
    this.setState({viewModalShown: false});
  }

  handleEditTitleChange(unsavedTitle) {
    this.setState({
      unsavedNote: {
        title: unsavedTitle,
        content: this.state.unsavedNote.content
      }
    });
  }

  handleEditContentChange(unsavedContent) {
    this.setState({
      unsavedNote: {
        title: this.state.unsavedNote.title,
        content: unsavedContent
      }
    });
  }

  handleEditDiscardClick() {
    this.setState({
      unsavedNote: {
        title: '',
        content: ''
      },
      viewModalShown: true,
      editModalShown: false
    });
  }

  handleEditSaveClick() {
    this.setState({
      savedNotes: this.state.savedNotes.map(savedNote => {
        if (savedNote.id === this.state.currentNote.id) {
          return Object.assign({}, this.state.currentNote, this.state.unsavedNote);
        } else {
          return savedNote;
        }
      }),
      currentNote: Object.assign(this.state.currentNote, this.state.unsavedNote),
      unsavedNote: {
        title: '',
        content: ''
      },
      viewModalShown: true,
      editModalShown: false
    }, () => {
      localStorage.setItem('savedNotes', JSON.stringify(this.state.savedNotes));
    });
  }

  handleEditCloseClick() {
    this.handleEditDiscardClick();
  }

  render() {
    return (
      <div className="notes-app">
        <h1 className="notes-app-heading">Notes</h1>
        <div className="notes-controls">
          <SearchField searchText={this.state.searchText} onSearchTextChange={this.handleSearchTextChange} />
          <div className="notes-button-controls">
            <SelectButton
              shown={!this.state.selectionMode}
              onSelectClick={this.handleSelectClick}
            />
            <CancelButton
              shown={this.state.selectionMode}
              onCancelClick={this.handleCancelClick}
            />
            <DeleteButton
              shown={this.state.selectionMode}
              onDeleteClick={this.handleDeleteClick}
            />
            <button className="create-note-button" onClick={this.handleCreateClick}>+</button>
          </div>
        </div>
        <Notes
          savedNotes={this.state.savedNotes}
          selectedNoteIds={this.state.selectedNoteIds}
          searchText={this.state.searchText}
          onNoteClick={this.handleNoteClick}
        />
        <CreateNoteModal
          shown={this.state.createModalShown}
          title={this.state.unsavedNote.title}
          content={this.state.unsavedNote.content}
          onCloseClick={this.handleCreateCloseClick}
          onTitleChange={this.handleCreateTitleChange}
          onContentChange={this.handleCreateContentChange}
          onDiscardClick={this.handleCreateDiscardClick}
          onSaveClick={this.handleCreateSaveClick}
        />
        <ViewNoteModal
          shown={this.state.viewModalShown}
          title={this.state.currentNote.title}
          content={this.state.currentNote.content}
          onCloseClick={this.handleViewCloseClick}
          onDeleteClick={this.handleViewDeleteClick}
          onEditClick={this.handleViewEditClick}
        />
        <EditNoteModal
          shown={this.state.editModalShown}
          title={this.state.unsavedNote.title}
          content={this.state.unsavedNote.content}
          onCloseClick={this.handleEditCloseClick}
          onTitleChange={this.handleEditTitleChange}
          onContentChange={this.handleEditContentChange}
          onDiscardClick={this.handleEditDiscardClick}
          onSaveClick={this.handleEditSaveClick}
        />
      </div>
    );
  }
}

const predefinedNotes = [
  {id: 1, title: "ToDo List", content: "write a React SPA\ndo laundary\nget new headphones"},
  {id: 2, title: "Technologies to keep an eye on", content: "AI\nQuantum Computing"},
  {id: 3, title: "Favourite Colors", content: "Alice:\nblue\nwhite\n\nBob:\ngreen\n\nCammy:\nred\ngreen"},
  {id: 4, title: "Journal", content: "2020-02-10:\nFinally beat the mobile game I downloaded last week. It's time to do some actual work :D\n\n2020-04-08:\nFinally have a functional version of my first game developed! Time to share it with my family and friends :D"},
  {id: 5, title: "Reading List", content: "Harry Potter series\nThe Hobbit\nLord of the Rings series"}
]

ReactDOM.render(<NotesApp predefinedNotes={predefinedNotes} />, document.getElementById('root'));
