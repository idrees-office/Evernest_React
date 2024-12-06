import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, IRootState } from '../../store';
import { setPageTitle } from '../../slices/themeConfigSlice';
import IconBell from '../../components/Icon/IconBell';
import { useNavigate, Link } from 'react-router-dom';
import Table from '../../components/Table';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrash from '../../components/Icon/IconTrash';
import Swal from 'sweetalert2';
import Toast from '../../services/toast';
import Loader from '../../services/loader';
import { listnews, deleteNews } from "../../slices/newsSlice";

const NewsList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast    = Toast();
    const loader   = Loader();
    useEffect(() => {
        dispatch(setPageTitle('News List'));
        dispatch(listnews());   
    }, [dispatch]);
    const { news, loading } = useSelector((state: IRootState) => state.news);
    const tableData = (Array.isArray(news) ? news : []).map((news: any, index: number) => ({
        counter: index + 1,
        title: news.title || 'Unknown',
        id: news.id,
    }));
    const handelDistory = (event:number) : void => {
        const id = event;
        Swal.fire({
            html: 'Are you sure you want to delete this project?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                 dispatch(deleteNews(id)).unwrap().then(() => {
                    toast.success('Delete Successfully');
                })
                .catch((error:any) => {
                    Swal.fire('Error!', 'Failed to delete the blog.', 'error');
                });
            }
        });
    }  
    return(
        <div>
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary relative">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3"> <IconBell /> </div>
                <span className="ltr:mr-3 rtl:ml-3">Blogs: </span> <Link to="/pages/news/create" className="btn btn-primary btn-sm">Create</Link>
            </div>
            <div className="datatables">
            {loading ? ( loader  )   : (
                <Table title="Blog List"
                    columns={[
                        { accessor: 'counter', title: '#', sortable: true },
                        { accessor: 'title', title: 'Title', sortable: true },
                        {
                            accessor: 'actions',
                            title: 'Actions',
                            render: (record) => (
                              <div className="flex items-center space-x-2">
                                 <button type="button" onClick={() => navigate(`/pages/news/create/${record.id}`)} className="btn btn-warning w-6 h-6 p-0 rounded-full"> <IconPencil className="w-3 h-3 shrink-0" /></button>
                                 <button type="button" onClick={() => handelDistory(record.id)} className="btn btn-danger w-6 h-6 p-0 rounded-full"> <IconTrash className="w-3 h-3 shrink-0" /></button>
                              </div>
                            ),
                        },
                    ]} 
                    rows={tableData}
                    />
                )}
            </div>
        </div>

    );
}


export default NewsList;