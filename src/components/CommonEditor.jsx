import React, { memo, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import translations from 'ckeditor5/translations/ko.js';
import "@/css/commonEditor.css";

const CommonEditor = memo(({ value, onChange}) => {

    const [editorLoaded, setEditorLoaded] = useState(false);

    useState(() => {
        import('@ckeditor/ckeditor5-react').then((module) => {
            setEditorLoaded(true);
        });
    }, []);

    return (
        <>
        {editorLoaded ? (
            <CKEditor
                editor={ClassicEditor}
                data={value}
                onChange={(event, editor) => onChange(editor.getData())}

                config={{
                    licenseKey: "GPL",
                    language: 'ko',
                    translations: [translations]
                }}
            />
        ) : (<p>에디터를 로딩중입니다.</p>)
        }
        </>
    );

});

export default CommonEditor;