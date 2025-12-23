import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
            <h1 className="text-3xl font-bold mb-6 text-primary">Terms & Conditions</h1>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. Project Usage Rights</h2>
                <ul className="list-disc pl-5 space-y-1">
                    <li>All projects are provided only for <strong>academic, learning, and demo purposes</strong>.</li>
                    <li>Reselling, redistributing, sharing source code, uploading to GitHub, or using for commercial purposes is <strong>strictly prohibited</strong> unless officially agreed in writing.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. Ownership & Intellectual Property</h2>
                <ul className="list-disc pl-5 space-y-1">
                    <li>All source code, designs, documentation, diagrams, and content remain the <strong>intellectual property of our team</strong>.</li>
                    <li>Buyers receive a <strong>limited, non-transferable usage license only</strong>.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. Customization Policy</h2>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Minor customization</strong> (UI text, variable names, configuration changes) is included only if discussed before purchase.</li>
                    <li><strong>Major changes</strong>, new features, or additional hardware/software modules will be <strong>charged separately</strong>.</li>
                    <li>Any request <strong>after delivery</strong> is treated as paid support.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. Estimated Timeline</h2>
                <p className="mb-2"><strong>Estimated project completion time: 15 working days</strong></p>
                <p className="mb-1">Timeline may vary based on:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Project complexity</li>
                    <li>Customization level</li>
                    <li>Hardware availability</li>
                    <li>Third-party APIs / hosting services</li>
                </ul>
                <p className="mt-2 text-sm italic">Delays caused by late requirements or college-side changes are not our responsibility.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">5. Delivery Policy</h2>
                <p className="mb-1">Projects will be delivered via:</p>
                <ul className="list-disc pl-5 space-y-1 mb-2">
                    <li>Google Drive / Private GitHub / ZIP / Email</li>
                </ul>
                <p className="font-medium">Final delivery is done only after full payment confirmation.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">6. Payment Terms</h2>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Advance payment is mandatory</strong> to initiate the project.</li>
                    <li>Full payment must be completed before final delivery.</li>
                    <li>Once paid, the amount is <strong>non-refundable</strong>.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">7. Refund & Cancellation</h2>
                <p className="mb-2"><strong>No refunds</strong> once the project work has started.</p>
                <p className="mb-1"><strong>No refunds</strong> after:</p>
                <ul className="list-disc pl-5 space-y-1 mb-2">
                    <li>Code delivery</li>
                    <li>Report sharing</li>
                    <li>Demo or explanation session</li>
                </ul>
                <p className="text-sm">If we cancel the project (rare case), refund will be handled fairly.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">8. Support Policy</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-medium mb-1 border-b border-gray-200 dark:border-gray-700 pb-1">Included support:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Project explanation</li>
                            <li>Setup & run guidance</li>
                            <li>Basic doubt clarification</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium mb-1 border-b border-gray-200 dark:border-gray-700 pb-1">Not included:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Unlimited revisions</li>
                            <li>Viva coaching</li>
                            <li>Marks guarantee</li>
                            <li>Long-term debugging</li>
                        </ul>
                    </div>
                </div>
                <p className="mt-2 text-sm">Support period is limited unless extended support is purchased.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">9. Hardware Disclaimer (If Applicable)</h2>
                <p className="mb-1">Hardware performance depends on:</p>
                <ul className="list-disc pl-5 space-y-1 mb-2">
                    <li>Component quality</li>
                    <li>Wiring</li>
                    <li>Power supply</li>
                    <li>Usage environment</li>
                </ul>
                <p className="font-medium">We are not responsible for hardware damage or misuse after delivery.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">10. Confidentiality</h2>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Your project details remain confidential.</li>
                    <li>We may showcase screenshots or demo visuals for portfolio purposes without revealing personal details.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">11. Legal Jurisdiction</h2>
                <p>All terms are governed by the laws of India.</p>
            </section>

            <section className="mt-8 p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-bold mb-2">12. Acceptance</h2>
                <p className="mb-4">By proceeding with payment, you confirm that you agree to all the above terms and conditions.</p>

                <h3 className="font-bold text-primary mb-1">Need Help?</h3>
                <p>If you have any doubts, questions, or custom requirements,</p>
                <p className="font-medium">Contact our team anytime — we’re happy to help.</p>
            </section>
        </div>
    );
};

export default TermsAndConditions;
