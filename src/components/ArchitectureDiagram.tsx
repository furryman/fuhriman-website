'use client'

import styles from './ArchitectureDiagram.module.css'

export default function ArchitectureDiagram() {
  return (
    <div className={styles.diagram}>
      {/* Row 1: Developer */}
      <div className={styles.row}>
        <div className={`${styles.node} ${styles.developer}`}>
          <span className={styles.nodeIcon}>&#9998;</span>
          <span className={styles.nodeLabel}>Developer</span>
        </div>
      </div>

      <div className={styles.connector}>
        <div className={styles.vLine} />
        <span className={styles.connectorLabel}>git push</span>
      </div>

      {/* Row 2: GitHub Actions Pipeline */}
      <div className={styles.row}>
        <div className={`${styles.nodeGroup} ${styles.cicd}`}>
          <div className={styles.groupHeader}>
            <span className={styles.groupIcon}>&#9881;</span>
            GitHub Actions CI/CD
          </div>
          <div className={styles.pipelineFlow}>
            <div className={styles.pipelineNode}>Lint &amp; Audit</div>
            <span className={styles.arrow}>&#8594;</span>
            <div className={styles.pipelineNode}>Build Image</div>
            <span className={styles.arrow}>&#8594;</span>
            <div className={styles.pipelineNode}>Push to Hub</div>
            <span className={styles.arrow}>&#8594;</span>
            <div className={styles.pipelineNode}>Trivy Scan</div>
            <span className={styles.arrow}>&#8594;</span>
            <div className={styles.pipelineNode}>Update Helm</div>
          </div>
        </div>
      </div>

      {/* Split connector */}
      <div className={styles.splitConnector}>
        <div className={styles.splitCenter}>
          <div className={styles.vLine} />
        </div>
        <svg className={styles.splitSvg} viewBox="0 0 600 40" preserveAspectRatio="none">
          <path d="M 300 0 L 300 15 L 150 15 L 150 40" stroke="rgba(124,106,240,0.35)" strokeWidth="2" fill="none" />
          <path d="M 300 0 L 300 15 L 450 15 L 450 40" stroke="rgba(124,106,240,0.35)" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Row 3: Docker Hub + eks-helm-charts */}
      <div className={styles.splitRow}>
        <div className={`${styles.node} ${styles.registry}`}>
          <span className={styles.nodeIcon}>&#128230;</span>
          <span className={styles.nodeLabel}>Docker Hub</span>
          <span className={styles.nodeSub}>Image Store</span>
        </div>
        <div className={`${styles.node} ${styles.helmCharts}`}>
          <span className={styles.nodeIcon}>&#9878;</span>
          <span className={styles.nodeLabel}>eks-helm-charts</span>
          <span className={styles.nodeSub}>values.yaml</span>
        </div>
      </div>

      {/* Middle section: Docker Hub line + ArgoCD + merge into k3s */}
      <div className={styles.middleSection}>
        {/* SVG lines spanning the full middle section */}
        <svg className={styles.middleSvg} viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
          {/* Docker Hub dashed line — runs down the left side into k3s */}
          <path d="M 150 0 L 150 200" stroke="rgba(96,165,250,0.3)" strokeWidth="2" fill="none" strokeDasharray="6 4" />
          <text x="135" y="195" fill="rgba(96,165,250,0.4)" fontSize="9" fontFamily="monospace" textAnchor="end">pulls image</text>
          {/* eks-helm-charts line down to ArgoCD */}
          <path d="M 450 0 L 450 30 L 300 30 L 300 60" stroke="rgba(124,106,240,0.35)" strokeWidth="2" fill="none" />
          <text x="385" y="22" fill="rgba(167,139,250,0.5)" fontSize="9" fontFamily="monospace">watches</text>
          {/* ArgoCD down to k3s */}
          <path d="M 300 140 L 300 200" stroke="rgba(124,106,240,0.35)" strokeWidth="2" fill="none" />
          <text x="310" y="175" fill="rgba(167,139,250,0.5)" fontSize="9" fontFamily="monospace">deploys</text>
        </svg>
        {/* ArgoCD node positioned in the middle */}
        <div className={styles.middleNode}>
          <div className={`${styles.node} ${styles.argocd}`}>
            <span className={styles.nodeIcon}>&#9851;</span>
            <span className={styles.nodeLabel}>ArgoCD</span>
            <span className={styles.nodeSub}>GitOps Engine</span>
          </div>
        </div>
      </div>

      {/* Row 5: EC2 / k3s cluster */}
      <div className={styles.row}>
        <div className={`${styles.nodeGroup} ${styles.cluster}`}>
          <div className={styles.groupHeader}>
            <span className={styles.groupIcon}>&#9729;</span>
            AWS EC2 t3.small &mdash; k3s
          </div>
          <div className={styles.clusterInner}>
            <div className={styles.groupSubHeader}>Kubernetes Workloads</div>
            <div className={styles.workloads}>
              <div className={`${styles.workloadNode} ${styles.certManager}`}>
                <span className={styles.workloadIcon}>&#128274;</span>
                cert-manager
                <span className={styles.workloadSub}>Let&apos;s Encrypt</span>
              </div>
              <div className={`${styles.workloadNode} ${styles.ingress}`}>
                <span className={styles.workloadIcon}>&#127760;</span>
                ingress-nginx
                <span className={styles.workloadSub}>ServiceLB</span>
              </div>
              <div className={`${styles.workloadNode} ${styles.website}`}>
                <span className={styles.workloadIcon}>&#9734;</span>
                fuhriman-website
                <span className={styles.workloadSub}>This Website!</span>
              </div>
            </div>
            <div className={styles.iptablesBar}>
              iptables: Hairpin NAT fix (pod CIDR &#8594; kube-proxy chains)
            </div>
          </div>
        </div>
      </div>

      <div className={styles.connector}>
        <div className={styles.vLine} />
      </div>

      {/* Row 6: Output */}
      <div className={styles.row}>
        <div className={`${styles.node} ${styles.output}`}>
          <span className={styles.nodeLabel}>https://fuhriman.org</span>
        </div>
      </div>
    </div>
  )
}
