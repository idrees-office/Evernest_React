import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../slices/themeConfigSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './blogs.css';
import Select from 'react-select';
import { createBlog, listBlog } from '../../slices/blogSlice';
import { options } from '../../statusServices/status';
import { AppDispatch, IRootState } from '../../store';

const Create = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isSuccess = useSelector((state: IRootState) => state.blogs.success);
    const blogs = useSelector((state: IRootState) => state.blogs.blogs);

    useEffect(() => {
        if (isEdit === true) {
            dispatch(listBlog({ type: 'edit', payload: id })).unwrap().then((response) => {
                const currentStatus = options.find(option => option.value === response.data.status);
              setFormData({
                title: response.data.title || "",
                description: response.data.description || "",
                slug: response.data.slug || "",
                seo_title: response.data.seo_title || "",
                seo_description: response.data.seo_description || "",
                blogs_image: null, 
                status: currentStatus || null,
             });
           }).catch((error: any) => {
                    // Swal.fire('Error!', 'Failed to delete the blog.', 'error');
            });
        }

        dispatch(setPageTitle('Create Blogs'));
        if (isSuccess) {
            navigate('pages/blogs/list'); // Navigate
        }
    }, [dispatch, isEdit, id, isSuccess]);

    const [filed, setFormData] = useState({
        title: '',
        description: '',
        slug: '',
        seo_title: '',
        seo_description: '',
        blogs_image: null,
        status: '',
    });
    const handleChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            blogs_image: file,
        }));
    };
    const handleSelectChange = (selectedOption: any) => {
        const { value } = selectedOption;
        setFormData((prevData) => ({
            ...prevData,
            status: value,
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', filed.title);
        formData.append('description', filed.description);
        formData.append('slug', filed.slug);
        formData.append('seo_title', filed.seo_title);
        formData.append('seo_description', filed.seo_description);
        if (filed.blogs_image) {
            formData.append('blogs_image', filed.blogs_image);
        }
        if (filed.status) {
            formData.append('status', filed.status);
        }
        dispatch(createBlog(formData) as any).then((response: any) => {
            console.log(response);
        });

        

    };
    return (
        <div>
            <div className="flex flex-col xl:flex-row">
                <div className="panel flex-1 px-2 py-2">
                    <div className="flex justify-between items-center">
                        <h5 className="text-lg font-semibold dark:text-white-light">{isEdit ? 'Update Blog' : 'Create Blog'}</h5>
                        <a className="btn btn-secondary btn-sm mt-2 cursor-pointer">Back</a>
                    </div>
                    <form encType="multipart/form-data" onSubmit={handleSubmit}>
                        <hr className="my-6 border-[#e0e6ed] dark:border-[#1b2e4b]" />
                        <div className="mt-8 px-4">
                            <div className="flex flex-col justify-between lg:flex-row">
                                <div className="mb-6 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                                    <div className="mt-4 items-center">
                                        <label htmlFor="titlemark" className="text-white-dark">
                                            Title
                                        </label>
                                        <input
                                            id="titlemark"
                                            autoComplete="off"
                                            type="text"
                                            className="form-input flex-1"
                                            placeholder="Title"
                                            onChange={handleChange}
                                            name="title"
                                            value={filed.title}
                                        />
                                    </div>
                                    <div className="mt-4 items-center">
                                        <label htmlFor="titlemark" className="text-white-dark">
                                            Description
                                        </label>
                                        <ReactQuill
                                            theme="snow"
                                            placeholder="Blog Description"
                                            value={filed.description}
                                            onChange={(value) => setFormData((prevData) => ({ ...prevData, description: value }))}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="slugmark" className="text-white-dark">
                                            Slug
                                        </label>
                                        <input id="slugmark" autoComplete="off" type="text" className="form-input flex-1" placeholder="Slug" onChange={handleChange} name="slug" value={filed.slug} />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="seotitle" className="text-white-dark">
                                            Seo Title
                                        </label>
                                        <input
                                            id="seotitle"
                                            autoComplete="off"
                                            type="text"
                                            className="form-input flex-1"
                                            placeholder="Seo Title"
                                            onChange={handleChange}
                                            name="seo_title"
                                            value={filed.seo_title}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="seotitle" className="text-white-dark">
                                            Seo Description
                                        </label>
                                        <ReactQuill
                                            theme="snow"
                                            placeholder="Seo Description"
                                            value={filed.seo_description}
                                            onChange={(value) => setFormData((prevData) => ({ ...prevData, seo_description: value }))}
                                        />
                                    </div>
                                    <div className="mt-4 items-center">
                                        <label htmlFor="ctnFile" className="text-white-dark">
                                            Image
                                        </label>
                                        <input
                                            id="ctnFile"
                                            type="file"
                                            className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-secondary/90 ltr:file:mr-5 rtl:file:ml-5 file:text-white file:hover:bg-primary"
                                            required
                                            name="blog_image"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="ctnstatus" className="text-white-dark">
                                            Status
                                        </label>
                                        <Select placeholder="Select an option" options={options} value={filed.status} onChange={handleSelectChange} />
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
};

export default Create;
