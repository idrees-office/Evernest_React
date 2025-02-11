import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../slices/themeConfigSlice";
import ReactQuill from "react-quill";
import { options } from '../../services/status';
import { AppDispatch, IRootState } from '../../store';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'react-quill/dist/quill.snow.css';
import { CreateNews, editNews } from "../../slices/newsSlice";
import Toast from "../../services/toast";


const Create = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast = Toast();
    const formRef = useRef<HTMLFormElement>(null);
    const [newsdescription, setNewsDescription] = useState('');
    const [status, setStatus] = useState<any | null>(null);
    const [date, setDate] = useState<any>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    useEffect(() => {
        dispatch(setPageTitle('Create News'));
    })
    
    useEffect(() => {
        if (isEdit == true) {
            dispatch(editNews(Number(id))).unwrap().then((response) => {
                if (formRef.current) {
                    const form = formRef.current;
                    (form.querySelector('input[name="title"]') as HTMLInputElement).value = response.title || '';
                    form.slug.value = response.slug || '';
                    if (response.date) {
                        const parsedDate = new Date(response.date); 
                        setDate(parsedDate);
                    }
                    setNewsDescription(response.description || '');
                    setStatus(response.status || '');
                }
            })
            .catch((error: any) => {});
        }else{
            formRef.current?.reset();
            setNewsDescription('');
            setStatus(null);
        }
        dispatch(setPageTitle('Create Blogs'));
    }, [dispatch, isEdit, id]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            try {
                const response = await dispatch(CreateNews({ formData, id: Number(id) }) as any);
                if (response.meta.requestStatus === 'rejected' && response.payload) {
                    setErrors(response.payload);
                } else {
                    toast.success('Save Successfully');
                }
            } catch (error: any) {
                console.error('Error creating/updating news:', error);
            }
        }
    };
    return (
        <div>
            <div className="flex flex-col xl:flex-row">
                <div className="panel flex-1 px-2 py-2">
                    <div className="flex justify-between items-center">
                        <h5 className="text-lg font-semibold dark:text-white-light"></h5>
                        <a onClick={() => navigate('/pages/news/list')}   className="btn btn-secondary btn-sm mt-2 cursor-pointer">Back</a>
                    </div>
                    <form encType="multipart/form-data" ref={formRef} onSubmit={handleSubmit}>
                        <hr className="my-6 border-[#e0e6ed] dark:border-[#1b2e4b]" />
                        <div className="mt-8 px-4">
                            <div className="flex flex-col justify-between lg:flex-row">
                                <div className="mb-6 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                                    <div className="mt-4 items-center">
                                        <label htmlFor="titlemark" className="text-white-dark"> Title </label>
                                        <input id="titlemark" autoComplete="off" type="text" className="form-input flex-1" placeholder="Title" name="title" />
                                        {errors.title && <p className="text-danger">{errors.title[0]}</p>}
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="slugmark" className="text-white-dark"> Slug</label>
                                        <input id="slugmark" autoComplete="off" type="text" className="form-input flex-1" placeholder="Slug" name="slug" />
                                        {errors.slug && <p className="text-danger">{errors.slug[0]}</p>}
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="slugmark" className="text-white-dark"> Date</label>
                                            <Flatpickr value={date}  name="date"  options={{ dateFormat: 'd/m/Y'}} className="form-input" onChange={(date) => setDate(date)} />
                                            {errors.date && <p className="text-danger">{errors.date[0]}</p>}
                                    </div>
                                     <div className="mt-4 items-center">
                                        <label htmlFor="description" className="text-white-dark">  Description </label>
                                        <ReactQuill theme="snow" value={newsdescription} onChange={(value) => setNewsDescription(value)} placeholder="Description" />
                                        <input type="hidden" name="description" value={newsdescription} id="description" />
                                        {errors.description && <p className="text-danger">{errors.description[0]}</p>}
                                    </div> 
                                    <div className="mt-4 items-center">
                                        <label htmlFor="ctnFile" className="text-white-dark"> Image </label>
                                        <input id="ctnFile" type="file" className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-secondary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary" name="news_image" />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="ctnstatus" className="text-white-dark"> Status </label>
                                        <Select name="status" placeholder="Select an option" options={options} value={options.find((option) => option.value == status)} onChange={(selectedOption: any) => { setStatus(selectedOption.value); }}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <button className="btn btn-secondary w-full">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 

export default Create;