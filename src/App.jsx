// src/App.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/layout/Dashboard.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import VeterinariansList from './components/veterinarians/VeterinariansList';
import OwnerSearch from './components/owners/OwnerSearch';
import OwnerForm from './components/owners/OwnerForm';
import OwnerDetails from './components/owners/OwnerDetails';
import OwnerEdit from './components/owners/OwnerEdit.jsx';
import PetForm from './components/pets/PetForm';
import PetEdit from './components/pets/PetEdit';
import VisitForm from './components/visits/VisitForm';
import VisitEdit from './components/visits/VisitEdit';
import '@fortawesome/fontawesome-free/css/all.min.css';




function App() {
    return (
        <Router>
            <div className="container-fluid">
                <div className="row">
                    <Sidebar />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
                        <Header />
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/vets" element={<VeterinariansList />} />
                            <Route path="/owners" element={<OwnerSearch />} />
                            <Route path="/owners/new" element={<OwnerForm />} />
                            <Route path="/owners/:id" element={<OwnerDetails />} />
                            <Route path="/owners/:id/edit" element={<OwnerEdit />} />
                            <Route path="/owners/:id/pets/new" element={<PetForm />} />
                            <Route path="/pets/:id/edit" element={<PetEdit />} />
                            <Route path="/pets/:id/visits/new" element={<VisitForm />} />
                            <Route path="/visits/:id/edit" element={<VisitEdit />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;