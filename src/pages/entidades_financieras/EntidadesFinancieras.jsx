import Heading from './components/Heading';
import SearchBox from './components/SearchBox';
import EntitiesList from './components/EntitiesList';
import EmptyState from './components/EmptyState';
import NewEntityModal from '../../components/modals/NewEntityModal';

import { useEntidadesUI } from './hooks/use-entidades-ui';

export default function EntidadesFinancieras() {
    const {
        query,
        setQuery,
        filtered,
        openNew,
        setOpenNew,
        showEmpty,
        handleSaveNew,
        handleDelete,
        navigate,
    } = useEntidadesUI();

    return (
        <>
            <Heading onCreate={() => setOpenNew(true)} />

            <SearchBox query={query} setQuery={setQuery} />

            <EntitiesList
                filtered={filtered}
                query={query}
                navigate={navigate}
                onDelete={handleDelete}
            />

            {showEmpty && <EmptyState onCreate={() => setOpenNew(true)} />}

            <NewEntityModal
                open={openNew}
                onClose={() => setOpenNew(false)}
                onSave={handleSaveNew}
            />
        </>
    );
}
