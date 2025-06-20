import PerfectScrollbar from 'react-perfect-scrollbar';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../slices/themeConfigSlice';
import IconNotes from '../../components/Icon/IconNotes';
import IconNotesEdit from '../../components/Icon/IconNotesEdit';
import IconStar from '../../components/Icon/IconStar';
import IconSquareRotated from '../../components/Icon/IconSquareRotated';
import IconPlus from '../../components/Icon/IconPlus';
import IconMenu from '../../components/Icon/IconMenu';
import IconUser from '../../components/Icon/IconUser';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconEye from '../../components/Icon/IconEye';
import IconX from '../../components/Icon/IconX';
import { getBaseUrl } from '../../components/BaseUrl';
import { DataTableSortStatus } from 'mantine-datatable';
import apiClient from '../../utils/apiClient';

const endpoints = {
    listApi: `${getBaseUrl()}/announcements/show`,
};

const View = () => {
   const dispatch = useDispatch<AppDispatch>();
    const [notesList, setNoteList] = useState<any[]>([]);
    const defaultParams = { id: null, title: '', description: '', tag: '', user: '', thumb: '' };
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [isDeleteNoteModal, setIsDeleteNoteModal] = useState<any>(false);
    const [isShowNoteMenu, setIsShowNoteMenu] = useState<any>(false);
    const [isViewNoteModal, setIsViewNoteModal] = useState<any>(false);
    const [filterdNotesList, setFilterdNotesList] = useState<any>([]);
    const [selectedTab, setSelectedTab] = useState<any>('all');
    const [deletedNote, setDeletedNote] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    useEffect(() => {
        setPageTitle('Create Announcements')
        fetchAnnouncementsList();
    }, [page, pageSize, sortStatus, searchQuery]);

    const searchNotes = () => {
        if (selectedTab !== 'fav') {
            if (selectedTab !== 'all' || selectedTab === 'delete') {
                setFilterdNotesList(notesList.filter((d) => d.tag === selectedTab));
            } else {
                setFilterdNotesList(notesList);
            }
        } else {
            setFilterdNotesList(notesList.filter((d) => d.isFav));
        }
    };
     const fetchAnnouncementsList = async () => {
        try {
            const params = { page, per_page: pageSize, sort_field: sortStatus.columnAccessor, sort_order: sortStatus.direction, search: searchQuery};
            const response = await apiClient.get(endpoints.listApi, { params });
            if (response.data) {
                setNoteList(response.data.data || []); 
                setTotalRecords(response.data.data.total || 0);
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                window.location.href = '/error';
            }
            showServerError();
        }
    };

    const showServerError = () => {
            Swal.fire({
                text: 'Something went wrong on the server',
                icon: 'error',
                title: 'Server Error',
            });
    };
    
    const truncateDescription = (text: string) => {
        if (!text) return '';
        const words = text.split(' ');
        if (words.length > 20) {
            return words.slice(0, 20).join(' ') + '...';
        }
        return text;
    };

    const saveNote = () => {
        if (!params.title) {
            showMessage('Title is required.', 'error');
            return false;
        }
        if (params.id) {
            //update task
            let note: any = notesList.find((d: any) => d.id === params.id);
            note.title = params.title;
            note.user = params.user;
            note.description = params.description;
            note.tag = params.tag;
        } else {
            //add note
            let maxNoteId = notesList.reduce((max: any, character: any) => (character.id > max ? character.id : max), notesList[0].id);
            if (!maxNoteId) {
                maxNoteId = 0;
            }
            let dt = new Date();
            let note = {
                id: maxNoteId + 1,
                title: params.title,
                user: params.user,
                thumb: 'profile-21.jpeg',
                description: params.description,
                date: dt.getDate() + '/' + Number(dt.getMonth()) + 1 + '/' + dt.getFullYear(),
                isFav: false,
                tag: params.tag,
            };

            notesList.splice(0, 0, note);
            searchNotes();
        }
        showMessage('Note has been saved successfully.');
        setAddContactModal(false);
        searchNotes();
    };

    const tabChanged = (type: string) => {
        setSelectedTab(type);
        setIsShowNoteMenu(false);
        searchNotes();
    };

    const setFav = (note: any) => {
        let list = filterdNotesList;
        let item = list.find((d: any) => d.id === note.id);
        item.isFav = !item.isFav;

        setFilterdNotesList([...list]);
        if (selectedTab !== 'all' || selectedTab === 'delete') {
            searchNotes();
        }
    };

    const setTag = (note: any, name: string = '') => {
        let list = filterdNotesList;
        let item = filterdNotesList.find((d: any) => d.id === note.id);
        item.tag = name;
        setFilterdNotesList([...list]);
        if (selectedTab !== 'all' || selectedTab === 'delete') {
            searchNotes();
        }
    };

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const deleteNoteConfirm = (note: any) => {
        setDeletedNote(note);
        setIsDeleteNoteModal(true);
    };

    const viewNote = (note: any) => {
        setParams(note);
        setIsViewNoteModal(true);
    };

    const editNote = (note: any = null) => {
        setIsShowNoteMenu(false);
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (note) {
            let json1 = JSON.parse(JSON.stringify(note));
            setParams(json1);
        }
        setAddContactModal(true);
    };

    const deleteNote = () => {
        setNoteList(notesList.filter((d: any) => d.id !== deletedNote.id));
        searchNotes();
        showMessage('Note has been deleted successfully.');
        setIsDeleteNoteModal(false);
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    useEffect(() => {
        searchNotes();
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [selectedTab, notesList]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    return (
        <div>
            <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
                <div className={`bg-black/60 z-10 w-full h-full rounded-md absolute hidden ${isShowNoteMenu ? '!block xl:!hidden' : ''}`} onClick={() => setIsShowNoteMenu(!isShowNoteMenu)}></div>
                <div
                    className={`panel
                    p-4
                    flex-none
                    w-[240px]
                    absolute
                    xl:relative
                    z-10
                    space-y-4
                    h-full
                    xl:h-auto
                    hidden
                    xl:block
                    ltr:lg:rounded-r-md ltr:rounded-r-none
                    rtl:lg:rounded-l-md rtl:rounded-l-none
                    overflow-hidden ${isShowNoteMenu ? '!block h-full ltr:left-0 rtl:right-0' : 'hidden shadow'}`}
                >
                    <div className="flex flex-col h-full pb-16">
                        <div className="flex text-center items-center">
                            <div className="shrink-0">
                                <IconNotes />
                            </div>
                            <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">All Announcements</h3>
                        </div>

                        <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b] my-4"></div>
                        <PerfectScrollbar className="relative ltr:pr-3.5 rtl:pl-3.5 ltr:-mr-3.5 rtl:-ml-3.5 h-full grow">
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    className={`w-full flex justify-between items-center p-2 hover:bg-white-dark/10 rounded-md dark:hover:text-primary hover:text-primary dark:hover:bg-[#181F32] font-medium h-10 ${
                                        selectedTab === 'all' && 'bg-gray-100 dark:text-primary text-primary dark:bg-[#181F32]'
                                    }`}
                                    onClick={() => tabChanged('all')}
                                >
                                    <div className="flex items-center">
                                        <IconNotesEdit className="shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">All Notes</div>
                                    </div>
                                </button>
                                {/* <button
                                    type="button"
                                    className={`w-full flex justify-between items-center p-2 hover:bg-white-dark/10 rounded-md dark:hover:text-primary hover:text-primary dark:hover:bg-[#181F32] font-medium h-10 ${
                                        selectedTab === 'fav' && 'bg-gray-100 dark:text-primary text-primary dark:bg-[#181F32]'
                                    }`}
                                    onClick={() => tabChanged('fav')}
                                >
                                    <div className="flex items-center">
                                        <IconStar className="shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">Favourites</div>
                                    </div>
                                </button> */}
                                <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                                <div className="px-1 py-3 text-white-dark">Tags</div>
                            </div>
                        </PerfectScrollbar>
                    </div>
                    <div className="ltr:left-0 rtl:right-0 absolute bottom-0 p-4 w-full">
                        {/* <button className="btn btn-primary w-full" type="button" onClick={() => editNote()}>
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2 shrink-0" />
                            Add New Note
                        </button> */}
                    </div>
                </div>
                <div className="panel flex-1 overflow-auto h-full">
                    <div className="pb-5">
                        <button type="button" className="xl:hidden hover:text-primary" onClick={() => setIsShowNoteMenu(!isShowNoteMenu)}>
                            <IconMenu />
                        </button>
                    </div>

                    
                    {filterdNotesList.length ? (
                        <div className="sm:min-h-[300px] min-h-[400px]">
                            <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                                {filterdNotesList.map((note: any) => {
                                    return (
                                        <div key={note.id} className='panel pb-12 bg-info-light shadow-info'>
                                            <div className="min-h-[142px]">
                                                <div className="flex justify-between">
                                                    <div className="flex items-center w-max">
                                                        <div className="ltr:ml-2 rtl:mr-2">
                                                            {/* <div className="font-semibold">{note.user}</div> */}
                                                            <div className="text-sx text-white-dark">{note.updated_at}</div>
                                                        </div>
                                                    </div>
                                                    <div className="dropdown">
                                                        <Dropdown offset={[0, 5]} placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`} btnClassName="text-primary"
                                                            button={<IconHorizontalDots className="rotate-90 opacity-70 hover:opacity-100" />}>
                                                            <ul className="text-sm font-medium">
                                                                <li>
                                                                    <button type="button" onClick={() => viewNote(note)}>
                                                                        <IconEye className="w-4.5 h-4.5 ltr:mr-3 rtl:ml-3 shrink-0" />
                                                                        View
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mt-4">{note.title}</h4>
                                                    {/* <p className="text-white-dark mt-2">{note.description}</p> */}
                                                     <p className="text-white-dark mt-2">
                                                        {truncateDescription(note.description)}
                                                        {note.description && note.description.split(' ').length > 20 && (
                                                            <button type="button" className="text-primary ml-1 hover:underline"onClick={() => viewNote(note)}> Read More </button>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-5 left-0 w-full px-5">
                                                <div className="flex items-center justify-between mt-2">
                                                    {/* <div className="dropdown fdfdf">
                                                        <Dropdown
                                                            offset={[0, 5]}
                                                            placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                                                            btnClassName={`${
                                                                note.tag === 'personal'
                                                                    ? 'text-primary'
                                                                    : note.tag === 'work'
                                                                    ? 'text-warning'
                                                                    : note.tag === 'social'
                                                                    ? 'text-info'
                                                                    : note.tag === 'important'
                                                                    ? 'text-danger'
                                                                    : ''
                                                            }`}
                                                            button={
                                                                <span>
                                                                    <IconSquareRotated
                                                                        className={
                                                                            note.tag === 'personal'
                                                                                ? 'fill-primary'
                                                                                : note.tag === 'work'
                                                                                ? 'fill-warning'
                                                                                : note.tag === 'social'
                                                                                ? 'fill-info'
                                                                                : note.tag === 'important'
                                                                                ? 'fill-danger'
                                                                                : ''
                                                                        }
                                                                    />
                                                                </span>
                                                            }
                                                        >
                                                            <ul className="text-sm font-medium">
                                                                <li>
                                                                    <button type="button" onClick={() => setTag(note, 'personal')}>
                                                                        <IconSquareRotated className="ltr:mr-2 rtl:ml-2 fill-primary text-primary" />
                                                                        Personal
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button type="button" onClick={() => setTag(note, 'work')}>
                                                                        <IconSquareRotated className="ltr:mr-2 rtl:ml-2 fill-warning text-warning" />
                                                                        Work
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button type="button" onClick={() => setTag(note, 'social')}>
                                                                        <IconSquareRotated className="ltr:mr-2 rtl:ml-2 fill-info text-info" />
                                                                        Social
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button type="button" onClick={() => setTag(note, 'important')}>
                                                                        <IconSquareRotated className="ltr:mr-2 rtl:ml-2 fill-danger text-danger" />
                                                                        Important
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </Dropdown>
                                                    </div> */}
                                                    <div className="flex items-center">
                                                        {/* <button type="button" className="text-danger" onClick={() => deleteNoteConfirm(note)}><IconTrashLines /></button> */}
                                                        <button type="button" className="text-warning group ltr:ml-2 rtl:mr-2" onClick={() => setFav(note)}>
                                                            <IconStar className={`w-4.5 h-4.5 group-hover:fill-warning ${note.isFav && 'fill-warning'}`} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center sm:min-h-[300px] min-h-[400px] font-semibold text-lg h-full">No data available</div>
                    )}

                    

                    {/* <Transition appear show={isDeleteNoteModal} as={Fragment}>
                        <Dialog as="div" open={isDeleteNoteModal} onClose={() => setIsDeleteNoteModal(false)} className="relative z-[51]">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-[black]/60" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center px-4 py-8">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                            <button
                                                type="button"
                                                onClick={() => setIsDeleteNoteModal(false)}
                                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                            >
                                                <IconX />
                                            </button>
                                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Delete Notes</div>
                                            <div className="p-5 text-center">
                                                <div className="text-white bg-danger ring-4 ring-danger/30 p-4 rounded-full w-fit mx-auto">
                                                    <IconTrashLines className="w-7 h-7 mx-auto" />
                                                </div>
                                                <div className="sm:w-3/4 mx-auto mt-5">Are you sure you want to delete Notes?</div>

                                                <div className="flex justify-center items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setIsDeleteNoteModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={deleteNote}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition> */}

                    <Transition appear show={isViewNoteModal} as={Fragment}>
                        <Dialog as="div" open={isViewNoteModal} onClose={() => setIsViewNoteModal(false)} className="relative z-[51]">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-[black]/60" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center px-4 py-8">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                            <button
                                                type="button"
                                                onClick={() => setIsViewNoteModal(false)}
                                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                            >
                                                <IconX />
                                            </button>
                                            <div className="flex items-center flex-wrap gap-2 text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                                <div className="ltr:mr-3 rtl:ml-3">{params.title}</div>
                                                {params.tag && (
                                                    <button
                                                        type="button"
                                                        className={`badge badge-outline-primary rounded-3xl capitalize ltr:mr-3 rtl:ml-3 ${
                                                            (params.tag === 'personal' && 'shadow-primary',
                                                            params.tag === 'work' && 'shadow-warning',
                                                            params.tag === 'social' && 'shadow-info',
                                                            params.tag === 'important' && 'shadow-danger')
                                                        }`}
                                                    >
                                                        {params.tag}
                                                    </button>
                                                )}
                                                {params.isFav && (
                                                    <button type="button" className="text-warning">
                                                        <IconStar className="fill-warning" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <div className="text-base">{params.description}</div>

                                                <div className="ltr:text-right rtl:text-left mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setIsViewNoteModal(false)}>
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
            </div>
        </div>
    );
};

export default View;
